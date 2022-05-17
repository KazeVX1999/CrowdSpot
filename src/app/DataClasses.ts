export class TempUser{
    registrationID!: string;
    userEmail!: string;
    userPassword!: string;
    validationCode?: string;
    submittedTime!: Date;
}

export class User{
    userID!: number;
    userEmail!: string;
    userPassword!: string;
    userLocationSurveillanceTables?: UserLocationSurveillanceTables[];
}

export class UserAuthentication{
    authenticationID!: number;
    authenticationCode!: string;
    userID!: number;
    timeAuthenticated!: Date;
}


export class ResetPasswordTable{
    resetRequestID!: number;
    userID!: number;
    resetCode!: string;
    dateTimeRequested!: Date;
    userTables!: User;
}

export class UserLocationSurveillanceTables{
    locationID!: number;
    userID!: number;
    locationName!: string;
    locationDescription?: string;
    locationPeopleCount?: number;
    userCameraTables?: UserCameraTables[];
}

export class UserCameraTables{
    cameraID!: number;
    locationID!: number;
    cameraName!: string;
    cameraDescription?: string;
    cameraCode!: string;
    operationStatus!: number;
    operatingStatus!: number;
    userCameraInputs?: UserCameraInputsTables[];
}

export class UserCameraInputsTables{
    cameraInputID!: number;
    cameraID!: number;
    imageEncoded!: Int32Array[];
    timeTaken!: Date;    
}

export class recordPeopleCount{
    recordID!: number;
    locationID!: number;
    PeopleCount!: number;
    timeRecorded!: Date;
    TimeOnly!: string;
}

export class cameraMarksCoordinates{
    recocordIFrdID!: number;
    cameraID!: number;
    cordXStart!: number;
    cordYStart!: number;
    cordXEnd!: number;
    cordYEnd!: number;
    markType!: number;
}