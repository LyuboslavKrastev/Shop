import { LoggingService } from './services/logging.service';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private loggingService: LoggingService) { }

  ngOnInit(): void {
    this.authService.autoLogin();
    this.loggingService.printLog('Welcome to the machine');
  }
}
