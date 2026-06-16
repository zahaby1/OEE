import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// import Chart from 'chart.js/auto';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
