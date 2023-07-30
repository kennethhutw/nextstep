import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {
  AdminService
} from "../../../_services";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './../lightning-admin.css']
})
export class DashboardComponent implements OnInit {


  chart1 = {
    data: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        label: 'Premium',
        data: [50, 80, 60, 120, 80, 100, 60],
        backgroundColor: 'transparent',
        borderColor: '#5b6582',
        borderWidth: 2
      },
      {
        label: 'Free',
        data: [100, 60, 80, 50, 140, 60, 100],
        backgroundColor: 'transparent',
        borderColor: '#36a2eb',
        borderWidth: 2
      }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            fontColor: 'rgba(0,0,0,.6)',
            fontStyle: 'bold',
            beginAtZero: true,
            maxTicksLimit: 8,
            padding: 10
          }
        }]
      },
      responsive: true,
      legend: {
        position: 'bottom',
        display: false
      },
    }
  };
  // chart2 = {
  //   data: {
  //     labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  //     datasets: [
  //       {
  //         label: 'Free',
  //         data: [100, 60, 80, 50, 140, 60, 100],
  //         backgroundColor: '#36a2eb',
  //         borderColor: '#36a2eb',
  //         borderWidth: 2
  //       }
  //     ]
  //   },
  //   options: {
  //     barValueSpacing: 1,
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           fontColor: 'rgba(0,0,0,.6)',
  //           fontStyle: 'bold',
  //           beginAtZero: true,
  //           maxTicksLimit: 8,
  //           padding: 10
  //         }
  //       }],
  //       xAxes: [{
  //         barPercentage: 0.4
  //       }]
  //     },
  //     responsive: true,
  //     legend: {
  //       position: 'bottom',
  //       display: false
  //     },
  //   }
  // };
  chart3 = {
    data: {
      datasets: [{
        data: [6, 12, 10],
        backgroundColor: ["#5b6582", "#98a4c7", "#36a2eb"],
      }],
      labels: [
        'html',
        'css',
        'javascript'
      ]

    },
    options: {
      legend: {
        position: 'bottom',
        display: false
      },
      cutoutPercentage: 80
    }
  };
  Nums: any;
  total = 0;
  usersNum = 0;
  projectNum = 0;
  totalEdition = 0;
  soldArtwork = 0;
  constructor(
    private adminSrv: AdminService
  ) { }

  ngOnInit() {

    this.adminSrv.getStatistics().subscribe(res => {
      if (res["result"] == "successful") {
        let data = res["data"];
        if (data != null) {

          this.usersNum = data["users"];
          this.projectNum = data["projects"];
        }
      }
    }, error => {
      console.error("error ", error);
    })



    this.adminSrv.getNewSignUpsperDay().subscribe(res => {
      if (res["result"] == "successful") {
        const series: any = {
          name: 'Users',
          data: res['data'].reverse(),
        };
        let _y = [];
        let _x = [];
        res['data'].forEach(element => {
          _y.push(element.y
          );
          _x.push(this.ConvertUnixTimeToDateString(element.x));
        });
        this.initialChart(_y, _x);
      }
    }, error => {
      console.error("error ", error);
    })


    new Chart('chart-line', {
      type: 'line',
      data: this.chart1.data
    });
    //  new Chart('chart-bar2', {
    //    type: 'bar',
    //    data: this.chart2.data
    //  });
    new Chart('chart-doughnut', {
      type: 'doughnut',
      data: this.chart3.data
    });

  }

  initialChart(y, x) {
    let chart2 = {
      data: {
        labels: x,
        datasets: [
          {
            label: 'Users',
            data: y,
            backgroundColor: '#36a2eb',
            borderColor: '#36a2eb',
            borderWidth: 2
          }
        ]
      },
      options: {
        barValueSpacing: 1,
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'rgba(0,0,0,.6)',
              fontStyle: 'bold',
              beginAtZero: true,
              maxTicksLimit: 8,
              padding: 10
            }
          }],
          xAxes: [{
            barPercentage: 0.4
          }]
        },
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },
      }
    };

    new Chart('chart-bar', {
      type: 'bar',
      data: chart2.data
    });
  }


  ConvertUnixTimeToDateString(timestamp) {
    var a = new Date(timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = ' ' + year + ' ' + month + ' ' + date;
    return time;
  }
}
