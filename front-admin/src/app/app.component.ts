import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-client';
  backgroundUrl: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const routeData = this.activatedRoute.snapshot.firstChild?.data;
      if (routeData && routeData['background']) {
        this.backgroundUrl = routeData['background'];
      }
      else {
        this.backgroundUrl = '';
      }
    });
  }
}