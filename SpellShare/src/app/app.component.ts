import { Component, OnInit } from '@angular/core';
import { CodeService } from './code.service';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule],
})
export class AppComponent implements OnInit {
  code: string = '';

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
    this.codeService.listenForCodeUpdates().subscribe(
    (newCode: string) => {this.code = newCode;}
  );
  }

  onCodeChange(newCode: string): void {
    this.codeService.sendCode(newCode);
  }
}
