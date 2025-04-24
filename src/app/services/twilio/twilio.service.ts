import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { connect, Room, createLocalTracks } from 'twilio-video';
import { SessionService } from '../session/session.service';
import { generateRoomName } from '../../shared/utils/room-utils';

@Injectable({
  providedIn: 'root',
})
export class TwilioVideoService {
  public room?: Room;
  public room$ = new BehaviorSubject<Room | null>(null);

  constructor(private session: SessionService) {}

  /**
   * Fetches a Twilio Video token using a given identity and room name.
   * @param identity - Firebase UID.
   * @param roomName - Room name.
   * @returns A token string.
   */
  async getToken(identity: string, roomName: string): Promise<string> {
    const url = import.meta.env.NG_APP_TOKEN_GENERATOR_URL;
    const params = new URLSearchParams({ identity, room: roomName });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }

  /**
   * Fetches a Twilio token for the currently logged-in user.
   * @param roomName - Name of the room to join.
   * @returns A token string.
   */
  async getTokenForCurrentUser(roomName: string): Promise<string> {
    const user = this.session.getUser();
    if (!user) throw new Error('No user is currently logged in');

    return this.getToken(user.email as string, roomName);
  }

  /**
   * Creates a new room using the user's session and returns token and unique room name.
   * @param baseRoomName - Base name input by the user.
   * @returns Token and unique room name.
   */
  async createRoom(baseRoomName: string): Promise<{ token: string; roomName: string }> {
    const user = this.session.getUser();
    if (!user) throw new Error('No user is currently logged in');

    const uniqueRoomName = generateRoomName(baseRoomName);
    const token = await this.getToken(user.uid, uniqueRoomName);
    return { token, roomName: uniqueRoomName };
  }

  /**
   * Connects to a Twilio room with the given token and track options.
   * @param roomName - Name of the room to join.
   * @param options - Audio/video enablement options.
   */
  async joinRoom(roomName: string, options?: { audio?: boolean; video?: boolean }): Promise<void> {
    const tracks = await createLocalTracks({
      audio: options?.audio ?? true,
      video: options?.video ?? true,
    });

    tracks.forEach((track) => {
      if (track.kind === 'audio' && options?.audio === false) track.disable();
      if (track.kind === 'video' && options?.video === false) track.disable();
    });

    const token = await this.getTokenForCurrentUser(roomName);

    this.room = await connect(token, { name: roomName, tracks });
    this.room$.next(this.room);

    this.room.on('disconnected', () => {
      this.room = undefined;
      this.room$.next(null);
    });
  }

  leaveRoom(): void {
    if (this.room) {
      this.room.disconnect();
      this.room = undefined;
      this.room$.next(null);
    }
  }

  muteAudio(): void {
    this.room?.localParticipant.audioTracks.forEach((publication) => publication.track.disable());
  }

  unmuteAudio(): void {
    this.room?.localParticipant.audioTracks.forEach((publication) => publication.track.enable());
  }

  disableVideo(): void {
    this.room?.localParticipant.videoTracks.forEach((publication) => publication.track.disable());
  }

  enableVideo(): void {
    this.room?.localParticipant.videoTracks.forEach((publication) => publication.track.enable());
  }

  toggleAudio(): void {
    this.room?.localParticipant.audioTracks.forEach((publication) =>
      publication.track.isEnabled ? publication.track.disable() : publication.track.enable(),
    );
  }

  toggleVideo(): void {
    this.room?.localParticipant.videoTracks.forEach((publication) =>
      publication.track.isEnabled ? publication.track.disable() : publication.track.enable(),
    );
  }
}
