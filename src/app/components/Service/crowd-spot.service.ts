import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';   
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class CrowdSpotService {
  API: string = 'https://crowdspotwebapi.1919280.win.studentwebserver.co.uk/CrowdSpotWebAPI/API';
  constructor(private http: HttpClient) { 

  }

  // AutoLogin by retrieveing code from localStorage
  AutoLogin(storedCode: string): Observable<any>{
    return this.http.get<any>(this.API + '/AutoLogIn?storedAuthenticatedCode=' + storedCode, {observe: 'response'});
  }
  
  // Login inputs are taken from Login Page
  LogIn(inputEmail: string, inputPassword: string): Observable<any>{
    return this.http.get<any>(this.API + '/LogIn?inputUserEmail=' + inputEmail + '&inputUserPassword=' + inputPassword, {observe: 'response'})    
  }

  // Search for user account, send valdiation code via Email and remove old reset process if exist.
  ResetProcess1(inputEmail: string): Observable<any>{
    return this.http.get<any>(this.API + '/ResetProcess1?inputUserEmail=' + inputEmail, {observe: 'response'})    
  }

  // Search for user account then check if its code is valid.
  ResetProcess2(inputEmail: string, inputResetCode: string): Observable<any>{
    return this.http.get<any>(this.API + '/ResetProcess2?inputUserEmail=' + inputEmail + "&inputResetCode=" + inputResetCode, {observe: 'response'})    
  }

  // Update user's account's password.
  ResetProcess3(inputEmail: string, inputPassword: string): Observable<any>{
    return this.http.get<any>(this.API + '/ResetProcess3?inputUserEmail=' + inputEmail + '&inputNewPassword=' + inputPassword, {observe: 'response'})    
  }

  // Check if the email has been registered with or not.
  SignUpProcess1(inputEmail: string, inputPassword: string): Observable<any>{
    return this.http.get<any>(this.API + '/SignUpProcess1?inputUserEmail=' + inputEmail + '&inputUserPassword=' + inputPassword, {observe: 'response'})    
  }

  // When code has been validated, move the user's account to the real user table.
  SignUpProcess2(inputEmail: string, inputCode: string): Observable<any>{
    return this.http.get<any>(this.API + '/SignUpProcess2?inputUserEmail=' + inputEmail + '&inputUserValidationCode=' + inputCode, {observe: 'response'})    
  }

  // Resend Code for Sign Up.
  SignUpResendCode(inputEmail: string): Observable<any>{
    return this.http.get<any>(this.API + '/SignUpResendCode?inputUserEmail=' + inputEmail, {observe: 'response'})    
  }

  // Web Form API --------------------
  UserEnquiry(userEmail: string, subject: string, text: string): Observable<any>{
    return this.http.get<any>(this.API + '/UserEnquiry?inputUserEmail=' + userEmail + '&subjectMessage=' + subject + '&textMessage=' + text, {observe: 'response'})    
  }

  // Change Password
  ChangePassword(userID: undefined | number, currentPassword: string, newPassword: string): Observable<any>{
    return this.http.get<any>(this.API + '/ChangePassword?userID=' + userID + '&currentPassword=' + currentPassword + '&newPassword=' + newPassword, {observe: 'response'})    
  }

  // Add New Location
  AddNewLocation(userID: undefined | number, LocationName: string, LocationDescription: string): Observable<any>{
    return this.http.get<any>(this.API + '/AddNewLocation?userID=' + userID + '&locationName=' + LocationName + '&locationDescription=' + LocationDescription, {observe: 'response'})    
  }

  // Refresh Locations
  RefreshLocations(userID: undefined | number, sortSTR: string): Observable<any>{
    switch (sortSTR){
      case "1":
        var sort = 1;
        break;
      case "2":
        var sort = 2;
        break;
      case "3":
        var sort = 3;
        break;
      case "4":
        var sort = 4;
        break;
      default:
        var sort = 1;
        break;
    }
    return this.http.get<any>(this.API + '/RefreshLocations?userID=' + userID + '&sort=' + sort, {observe: 'response'})    
  }

  // Get Location
  GetSurveillance(userID: undefined | number, locationID: null | undefined | number): Observable<any>{
    return this.http.get<any>(this.API + '/GetSurveillance?userID=' + userID + '&locationID=' + locationID, {observe: 'response'})    
  }

  // Update Location
  UpdateSurveillance(locationID: null | undefined | number, locationName: string, locationDescription: string): Observable<any>{
    return this.http.get<any>(this.API + '/UpdateSurveillance?locationID=' + locationID + '&locationName=' + locationName + '&locationDescription=' + locationDescription, {observe: 'response'})    
  }

  // Delete Location
  DeleteSurveillance(userID: undefined | number, locationID: null | undefined | number): Observable<any>{
    return this.http.get<any>(this.API + '/DeleteSurveillance?userID=' + userID + '&locationID=' + locationID, {observe: 'response'})        
  }

  // Add Camera
  AddCamera(userID: undefined | number, locationID: null | undefined | number, cameraName: string, cameraDescription: string, cameraCode: string, operationStatus: number): Observable<any>{
    return this.http.get<any>(this.API + '/AddCamera?userID=' + userID + '&locationID=' + locationID + '&cameraName=' + cameraName + '&cameraDescription=' + cameraDescription + '&cameraCode=' + cameraCode + '&operationStatus=' + operationStatus, {observe: 'response'})        
  }

  // Get Camera
  GetCamera(cameraID: number | null | undefined): Observable<any>{
    return this.http.get<any>(this.API + '/GetCamera?cameraID=' + cameraID, {observe: 'response'})        
  }

  // Refresh Cameras
  RefreshCameras(locationID: undefined | number | null, sortSTR: string): Observable<any>{
    switch (sortSTR){
      case "1":
        var sort = 1;
        break;
      case "2":
        var sort = 2;
        break;
      case "3":
        var sort = 3;
        break;
      case "4":
        var sort = 4;
        break;
      default:
        var sort = 1;
        break;
    }
    return this.http.get<any>(this.API + '/RefreshCameras?locationID=' + locationID + '&sort=' + sort, {observe: 'response'})    
  }

  // Update Camera
  UpdateCamera(cameraID: undefined | number | null, cameraName: string, cameraDescription: string, cameraCode: string, operationStatus: number): Observable<any>{
    return this.http.get<any>(this.API + '/UpdateCamera?cameraID=' + cameraID + '&cameraName=' + cameraName + '&cameraDescription=' + cameraDescription + '&cameraCode=' + cameraCode + '&operationStatus=' + operationStatus, {observe: 'response'})        
  }

  // Get New Camera Code
  GetNewCameraCode(): Observable<any>{
    return this.http.get<any>(this.API + '/GetNewCameraCode', {observe: 'response'})        
  }

  // Delete Camera
  DeleteCamera(locationID: undefined | number | null, cameraID: null | undefined | number): Observable<any>{
    return this.http.get<any>(this.API + '/DeleteCamera?&locationID=' + locationID + '&cameraID=' + cameraID, {observe: 'response'})        
  }

  // Check Server Status
  CheckServerStatus(): Observable<any> {
    return this.http.get<any>(this.API + '/CheckServerStatus', {observe: 'response'})        
  }

  // Toggle Camera Status
  ToggleCameraOperation(cameraID: number | undefined | null, status: number): Observable<any> {
    return this.http.get<any>(this.API + '/ToggleCameraOperation?cameraID=' + cameraID + '&status=' + status, {observe: 'response'})        
  }

  // Turn Camera Stream ON
  OnCameraStream(cameraID: number | undefined | null): Observable<any> {
    return this.http.get<any>(this.API + '/OnCameraStream?cameraID=' + cameraID, {observe: 'response'})        
  }

  // Turn Camera Stream OFF
  OffCameraStream(cameraID: number | undefined | null): Observable<any> {
    return this.http.get<any>(this.API + '/OffCameraStream?cameraID=' + cameraID, {observe: 'response'})        
  }

  // Get Streamed Images
  GetStreamInput(cameraID: number | undefined | null): Observable<any> {
    return this.http.get<any>(this.API + '/GetStreamInput?cameraID=' + cameraID, {observe: 'response'})        
  }

  // Upload Marks
  UploadMarks(cameraID: number | undefined | null, formData: FormData): Observable<any> {
    return this.http.post(this.API + '/UploadMarks?cameraID=' + cameraID, formData, {observe: 'response'})        
  }

  // Retrieve Marks
  RetrieveMarks(cameraID: number | undefined | null): Observable<any> {
    return this.http.get<any>(this.API + '/RetrieveMarks?cameraID=' + cameraID, {observe: 'response'})        
  }

  // Get Location Records
  GetLocationRecords(locationID: number | undefined | null): Observable<any> {
    return this.http.get<any>(this.API + '/GetLocationRecords?locationID=' + locationID, {observe: 'response'})        
  }
}


