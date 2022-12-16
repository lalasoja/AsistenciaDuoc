import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';


import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  isTeacher = false;
  actualCourses = [];

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  async ngOnInit() {
    this.formatDateValues();
    const profile_data = await this.storage.get('profile_data');
    if ((profile_data != null) && (profile_data.role == "PF")) {
      this.isTeacher = true;
    }
    this.retrieveCourses();
  }

  async retrieveCourses() {
    const actual_key = await this.storage.get('apikey');
    this.httpClient.get<any>('http://45.33.100.248:8000/courses/',
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                this.actualCourses = res;
              },
            error: error => {
              console.log(error);
            }
          })
  }

  
  courseForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    description: new FormControl(""),
    startDate: new FormControl(new Date(2000, 10, 10)),
    endDate: new FormControl(new Date(2000, 10, 10)),
  });

  private formatDateValues() {
    const startDate = this.courseForm.get('startDate').value;
    this.courseForm.get('startDate').patchValue(new Date(startDate).toISOString());


    const endDate = this.courseForm.get('endDate').value;
    this.courseForm.get('endDate').patchValue(new Date(endDate).toISOString());
  }

  async createCourseForm(_value: any) {

    const actual_key = await this.storage.get('apikey');
    this.httpClient.post<any>('http://45.33.100.248:8000/courses/',
          {
            name: this.courseForm.value.name,
            description: this.courseForm.value.description,
            start_date: this.courseForm.value.startDate,
            end_date: this.courseForm.value.endDate,
          },
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                this.actualCourses.push(res);
                this.retrieveCourses();
              },
            error: error => {
              console.log(error);
            }
          })

  }

  async createSession(course_id) {

    const actual_key = await this.storage.get('apikey');
    this.httpClient.post<any>('http://45.33.100.248:8000/sessions/',
          {
            course: course_id
          },
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                console.log(res);
                this.retrieveCourses();
              },
            error: error => {
              console.log(error);
            }
          })
  }

  async joinCourse(course_id) {
    const actual_key = await this.storage.get('apikey');
    this.httpClient.post<any>(`http://45.33.100.248:8000/courses/${course_id}/subscribe/`,
          {},
          {'headers': new HttpHeaders(
              {'Content-Type':'application/json', 'Authorization': `Token ${actual_key}`}
            )
          })
          .subscribe({
            next: async res => {
                this.retrieveCourses();
              },
            error: error => {
              console.log(error);
            }
          })
  }

}
