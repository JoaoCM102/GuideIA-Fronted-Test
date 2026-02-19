import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { showGuideHtml } from 'guideai-npm';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'guideia-frontend-test';

  ngAfterViewInit(): void {
    showGuideHtml();
  }
}
