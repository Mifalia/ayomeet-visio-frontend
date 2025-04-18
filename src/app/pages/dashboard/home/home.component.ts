import { Component, OnInit } from '@angular/core';
import { IUserSession, SessionService } from '../../../services/session/session.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private sessionService: SessionService) {}
  user: IUserSession | null = null;

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
  }
}
