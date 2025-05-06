import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwilioVideoService } from '../../../../services/twilio/twilio.service';
import { LocalVideoTrackPublication, RemoteAudioTrack, RemoteVideoTrack, RemoteParticipant } from 'twilio-video';
import { CommonModule } from '@angular/common';
import { generateUserAvatar } from '../../../../shared/utils/user-utils';
import { SessionService } from '../../../../services/session/session.service';
import { HamsterLoaderComponent } from '../../../../shared/components/hamster-loader/hamster-loader.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  imports: [CommonModule, HamsterLoaderComponent],
})
export class RoomComponent implements OnInit {
  @ViewChild('focusedRoomVideo', { static: true }) focusedRoomVideoElement!: ElementRef;
  @ViewChild('listRoomVideo', { static: true }) listRoomVideoElement!: ElementRef;
  router: Router = inject(Router);

  isLoading: boolean = true;
  loadingMessage: string = '';
  room_name: string | null = '';
  focusedParticipant: string = 'local';
  videoElements: Map<string, HTMLElement> = new Map();
  participants: { identity: string; element: HTMLElement }[] = [];
  generateUserAvatar = (k: string | null) => {
    return generateUserAvatar(k as string);
  };

  constructor(
    private route: ActivatedRoute,
    private roomService: TwilioVideoService,
    public session: SessionService,
  ) {}

  async ngOnInit() {
    this.room_name = this.route.snapshot.paramMap.get('room_name');
    this.isLoading = true;

    const devices = await this.checkDevicesAvailability();

    if (!devices.hasCamera || !devices.hasMicrophone) {
      this.loadingMessage = 'Your device does not support video/audio calls.';
      return;
    }

    const stream = await this.requestMediaAccess();
    if (!stream) {
      this.loadingMessage = 'You need to allow access to your camera and microphone.';
      return;
    }

    this.loadingMessage = 'Hold on, we are setting up your meeting room...';
    await this.loadRoomMeeting();
    this.isLoading = false;
  }

  leaveRoom() {
    this.roomService.leaveRoom();
    this.videoElements.forEach((el) => el.remove());
    this.router.navigate(['/meeting']);
  }

  async loadRoomMeeting() {
    if (!this.room_name) return;

    await this.roomService.joinRoom(this.room_name);

    // === Local video
    const localTrackPublication = Array.from(
      this.roomService.room?.localParticipant.videoTracks.values() as Iterable<LocalVideoTrackPublication>,
    )[0];
    const localTrack = localTrackPublication.track;
    const localVideoElement = localTrack.attach();
    this.videoElements.set('local', localVideoElement);
    this.participants.push({ identity: 'local', element: localVideoElement });
    this.setFocus('local');

    // === Participants already connected
    this.roomService.room?.participants.forEach((participant) => {
      this.subscribeToParticipant(participant);
    });

    // === New participants
    this.roomService.room?.on('participantConnected', (participant) => {
      this.subscribeToParticipant(participant);
    });
  }

  subscribeToParticipant(participant: RemoteParticipant) {
    const attachTrack = (track: RemoteVideoTrack | RemoteAudioTrack) => {
      if (track.kind === 'video') {
        const videoEl = track.attach();
        this.videoElements.set(participant.identity, videoEl);
        this.participants.push({ identity: participant.identity, element: videoEl });
        this.renderVideos();
      }
    };

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed && publication.track?.kind === 'video') {
        attachTrack(publication.track as RemoteVideoTrack);
      }
    });

    participant.on('trackSubscribed', (track) => {
      if (track.kind === 'video') {
        attachTrack(track as RemoteVideoTrack);
      }
    });
  }

  setFocus(identity: string) {
    if (!this.videoElements.has(identity)) return;

    const focusContainer = this.focusedRoomVideoElement.nativeElement;
    const listContainer = this.listRoomVideoElement.nativeElement;

    const newFocus = this.videoElements.get(identity)!;
    const oldFocus = this.videoElements.get(this.focusedParticipant)!;

    // Clean focus and swap
    focusContainer.innerHTML = '';
    focusContainer.appendChild(newFocus);

    if (this.focusedParticipant !== identity) {
      listContainer.appendChild(oldFocus);
    }

    this.focusedParticipant = identity;
    this.renderVideos();
  }

  renderVideos() {
    const listContainer = this.listRoomVideoElement.nativeElement;
    listContainer.innerHTML = '';

    this.participants.forEach((p) => {
      if (p.identity !== this.focusedParticipant) {
        const el = this.videoElements.get(p.identity);
        if (el) {
          el.onclick = () => this.setFocus(p.identity);
          listContainer.appendChild(el);
        }
      }
    });
  }

  async checkDevicesAvailability(): Promise<{ hasCamera: boolean; hasMicrophone: boolean }> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some((device) => device.kind === 'videoinput');
    const hasMicrophone = devices.some((device) => device.kind === 'audioinput');
    return { hasCamera, hasMicrophone };
  }

  async requestMediaAccess(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      return stream;
    } catch (error) {
      console.error('Camera and Audio no allowed', error);
      return null;
    }
  }
}
