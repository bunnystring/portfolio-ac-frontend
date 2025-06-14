import {
  Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillRank {
  rank: string;
  src: string;
}

@Component({
  selector: 'app-rocket-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rocket-scroll.html',
  styleUrl: './rocket-scroll.scss',
})
export class RocketScroll implements OnInit, AfterViewInit {
  @ViewChild('spaceRef', { static: true }) spaceRef!: ElementRef<HTMLDivElement>;

  public ranks: SkillRank[] = [
    { rank: 'Angular', src: '/assets/images/angularRank.png' },
    { rank: 'Mysql', src: '/assets/images/mysqlRank.png' },
    { rank: 'JavaScript', src: '/assets/images/javaScriptRank.png' },
    { rank: 'SpringBoot', src: '/assets/images/springBootRank.png' },
    { rank: 'Bootstrap', src: '/assets/images/bootstrapRank.png' },
    { rank: 'MongoDB', src: '/assets/images/mongoDbRank.png' },
  ];
  public rocketPos = { left: 10 };
  public cardsOffset: number[] = [];
  private percent = 0;
  private spread = 300;

  ngOnInit(): void {
    this.updateRocketAndBaraja();
  }

  ngAfterViewInit(): void {
    this.calculateSpread();
    this.updateRocketAndBaraja();
    window.addEventListener('resize', () => {
      this.calculateSpread();
      this.updateRocketAndBaraja();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateRocketAndBaraja();
  }

  private calculateSpread() {
    const minCardMargin = 30;
    const availableWidth = Math.max(
      window.innerWidth - 60,
      this.ranks.length * (minCardMargin + 80)
    );
    const n = this.ranks.length;
    if (n > 1) {
      this.spread = Math.min(
        (availableWidth * 0.5) - 60,
        (availableWidth - n * 120) / 2 + (minCardMargin * ((n-1)/2))
      );
      this.spread = Math.max(this.spread, (n-1)/2 * minCardMargin);
    } else {
      this.spread = 0;
    }
  }

  private updateRocketAndBaraja(): void {
    const space = this.spaceRef.nativeElement as HTMLElement;
    const rect = space.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const viewportCenter = windowHeight / 2;

    // Avance: 0 si el top está en el centro, 1 si el bottom está en el centro
    let percent = (viewportCenter - rect.top) / (rect.height);
    percent = Math.max(0, Math.min(1, percent));
    this.percent = percent;

    // Movimiento del cohete
    const minLeft = 10;
    const maxLeft = 90;
    this.rocketPos.left = minLeft + percent * (maxLeft - minLeft);

    // Desplazamiento de cartas
    const n = this.ranks.length;
    const spread = this.spread;
    this.cardsOffset = this.ranks.map((_, i) => {
      const mid = (n - 1) / 2;
      const rel = i - mid;
      return rel * spread * percent / mid;
    });
  }

  getCardStyle(i: number) {
    return {
      left: `calc(50% + ${this.cardsOffset[i]}px)`,
      zIndex: this.ranks.length - Math.abs(i - (this.ranks.length - 1) / 2),
      transform: 'translate(-50%, -50%)'
    };
  }

  trackBySrc(index: number, item: SkillRank) {
    return item.src;
  }
}
