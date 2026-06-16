import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';
import { OeeStateService } from '../../services/oee-state.service';
import { ExcelService } from '../../services/excel.service';
import { OeeViewModel } from '../../model/oee-viewmodel';
import { OeeInput, OeeResult } from '../../model/oee-input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Reactive state from service
  input$!: Observable<OeeInput>;
  result$!: Observable<OeeResult>;

  // Current state for direct access
  currentInput: OeeInput;
  currentResult: OeeResult;

  // View model helper
  vm = OeeViewModel;

  // Chart configurations
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Availability', 'Performance', 'Quality'],
    datasets: [
      {
        label: 'Metric value (%)',
        data: [0, 0, 0],
        backgroundColor: ['#0ea5e9', '#f59e0b', '#14b8a6'],
        borderRadius: 16,
        maxBarThickness: 42,
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = (context.parsed as any)?.y ?? 0;
            return `${Number(value).toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        max: 120,
        ticks: { callback: (value) => `${value}%` },
      },
    },
  };

  doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Availability', 'Performance', 'Quality'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#0ea5e9', '#f59e0b', '#14b8a6'],
        hoverOffset: 8,
      },
    ],
  };

  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
  };

  // Excel file handling
  uploadedFileName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  excelData: OeeInput[] = [];
  selectedRowIndex: number = 0;

  constructor(
    private oeeState: OeeStateService,
    private excelService: ExcelService
  ) {
    this.currentInput = this.oeeState.getInput();
    this.currentResult = this.oeeState.getResult();
    
    // Initialize observables from service
    this.input$ = this.oeeState.input$;
    this.result$ = this.oeeState.result$;
  }

  ngOnInit(): void {
    // Subscribe to result changes to update charts
    this.result$.subscribe((result: OeeResult) => {
      this.currentResult = result;
      this.updateCharts(result);
    });

    // Subscribe to input changes
    this.input$.subscribe((input: OeeInput) => {
      this.currentInput = input;
    });
  }

  /**
   * Handle input changes - delegates to state service
   */
  onInputChange(field: keyof OeeInput, value: any): void {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      this.oeeState.updateInput(field, numValue);
    }
  }

  /**
   * Update chart data when result changes
   */
  private updateCharts(result: OeeResult): void {
    const chartData = OeeViewModel.prepareChartData(result);

    this.barChartData.datasets[0].data = chartData;
    this.doughnutData.datasets[0].data = chartData;

    this.chart?.update();
  }

  /**
   * Reset all inputs and calculations
   */
  resetMetrics(): void {
    this.oeeState.reset();
  }

  /**
   * Handle Excel file upload
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      this.errorMessage = 'Please upload a valid Excel file (.xlsx or .xls)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.uploadedFileName = file.name;

    // Read Excel file
    this.excelService.readExcelFile(file)
      .then((data) => {
        this.excelData = data;
        this.selectedRowIndex = 0;
        this.isLoading = false;

        if (data.length === 0) {
          this.errorMessage = 'No valid data found in Excel file';
          return;
        }

        // Automatically load first row
        this.loadExcelRow(0);
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to read Excel file';
      });
  }

  /**
   * Load data from a specific row in Excel data
   */
  loadExcelRow(index: number): void {
    if (index < 0 || index >= this.excelData.length) return;

    this.selectedRowIndex = index;
    const data = this.excelData[index];
    
    // Update state with Excel data
    this.oeeState.setInput(data);
  }

  /**
   * Download Excel template
   */
  downloadTemplate(): void {
    this.excelService.downloadTemplate();
  }
}
