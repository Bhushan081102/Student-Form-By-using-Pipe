import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent {
  studentForm: FormGroup; // Form group for the student form
  submittedStudents: any[] = []; // Array to store submitted students
  maxBirthdate: string; // Maximum birthdate
  editIndex: number | null = null; // Index of student being edited

  constructor(private fb: FormBuilder) {
    // Initialize the form group with controls
    this.studentForm = this.fb.group({
      name: ['', Validators.required], // Name is required
      gender: ['', Validators.required], // Gender is required
      birthdate: ['', [Validators.required, this.birthdateValidator]], // Birthdate is required and must be valid
      batch: ['', Validators.required] // Batch is required
    });

    // Set maxBirthdate to today in YYYY-MM-DD format
    const today = new Date();
    this.maxBirthdate = formatDate(today, 'yyyy-MM-dd', 'en-US'); // Pipe operation for date formatting
  }

  // Custom validator for birthdate
  birthdateValidator(control: any) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate > today ? { futureDate: true } : null; // Return error if date is in the future
  }

  // Method to handle form submission
  onSubmit() {
    if (this.studentForm.valid) { // Check if form is valid
      const name = this.capitalizeName(this.studentForm.value.name);
      const title = this.studentForm.value.gender === 'Male' ? 'Mr.' : 'Mrs.';
      const age = this.calculateAge(this.studentForm.value.birthdate);

      const submittedData = {
        name: `${title} ${name}`,
        age: age,
        gender: this.studentForm.value.gender,
        birthdate: formatDate(this.studentForm.value.birthdate, 'MM/dd/yyyy', 'en-US'),
        batch: this.studentForm.value.batch
      };

      if (this.editIndex !== null) {
        // Update existing student
        this.submittedStudents[this.editIndex] = submittedData;
        this.editIndex = null; // Reset edit index
      } else {
        // Add new student
        this.submittedStudents.push(submittedData);
      }

      this.studentForm.reset(); // Reset the form after submission
    }
  }

  // Method to edit a student
  editStudent(index: number) {
    this.editIndex = index; // Set the index of the student to edit
    const student = this.submittedStudents[index];
    this.studentForm.patchValue({
      name: student.name.replace(/Mr\. |Mrs\. /, ''), // Remove title for editing
      gender: student.gender,
      birthdate: student.birthdate,
      batch: student.batch
    });
  }

  // Method to delete a student
  deleteStudent(index: number) {
    this.submittedStudents.splice(index, 1); // Remove student from the array
    if (this.editIndex === index) {
      this.clearForm(); // Clear form if deleting the current editing student
    }
  }

  // Method to clear the form
  clearForm() {
    this.studentForm.reset(); // Reset the form fields
    this.editIndex = null; // Reset edit index
  }

  // Method to capitalize name
  capitalizeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(); // Capitalizes first letter and makes the rest lower case
  }

  // Method to calculate age from birthdate
  calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970); // calculate age
  }
}
