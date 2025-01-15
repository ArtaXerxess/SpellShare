import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  private socket: any;
  private apiUrl = 'http://localhost:3000/';  // Backend URL

  constructor() {
    this.socket = io(this.apiUrl); // Initialize socket connection
  }

  // Send the updated code to the backend
  sendCode(code: string): void {
    this.socket.emit('updateCode', { code });
  }

  // Listen for code updates from other clients
  listenForCodeUpdates(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('codeUpdate', (newCode: string) => {
        observer.next(newCode);
      });
    });
  }
}
