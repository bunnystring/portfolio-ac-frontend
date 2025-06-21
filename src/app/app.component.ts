import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHeaderComponent } from "./components/shared/menu-header/menu-header/menu-header.component";
import { FooterComponent } from "./components/shared/footer/footer/footer.component";
import { CommonModule } from '@angular/common';
import { SpinnerIntro } from './components/shared/spinner-intro/spinner-intro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuHeaderComponent, FooterComponent, CommonModule, SpinnerIntro],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('starCanvas', { static: true }) starCanvas!: ElementRef<HTMLCanvasElement>;
  title = 'portfolio-ac';
  showSpinner = true;

  constructor() { }

  ngAfterViewInit(): void {
    this.initStars();
  }
  ngOnInit(): void {
  }

  initStars() {
    const canvas = this.starCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const STAR_COUNT = 120;
    const stars: { x: number; y: number; r: number; speed: number; opacity: number }[] = [];

    function randomStar() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.6,
        speed: Math.random() * 0.16 + 0.04,
        opacity: Math.random() * 0.7 + 0.3
      };
    }

    for (let i = 0; i < STAR_COUNT; i++) stars.push(randomStar());

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2, false);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
      }
    }

    function animate() {
      for (const star of stars) {
        star.x += star.speed;
        if (star.x > width + 10) {
          star.x = -10;
          star.y = Math.random() * height;
        }
      }
      drawStars();
      requestAnimationFrame(animate);
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      for (const star of stars) {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      }
    }

    window.addEventListener('resize', resize);
    drawStars();
    animate();
  }
}
