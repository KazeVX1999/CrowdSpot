

function ShowPassword(passwordInput, eyeIcon) {
    var password = document.getElementById(passwordInput);
    var eye = document.getElementById(eyeIcon);
    if (password.type === "password") {
        password.type = "text";
        eye.src = '../../../../assets/Images/eye-close.png';
    } else {
        password.type = "password";
        eye.src = '../../../../assets/Images/eye-open.png';
    }

}

function expandParentContainer(parent, activated){
    var theParent = document.getElementsByClassName(parent);
    theParent[0].classList.toggle(activated);
}

// Code adapted from w3Schools (n.d.) and Chart.js (n.d.).
function generateChart(theGraphElement, locationName, Time, peopleCount, day){
    var ctx = document.getElementById("theGraph").getContext("2d");

    var minY = Math.min(... peopleCount);
    var maxY = Math.max(... peopleCount);

    var theGraph = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "#b97373",
                data: peopleCount,
                label: "People Count: "
            }],
            labels: Time
        },
        options: {      
            responsive: true,
            legends: {
                display: true
            },
            scales: {
                x: {
                    min: new Date(day + "T00:00"),
                    max: new Date(day + "T24: 00"),
                    type: 'timeseries',
                    time: {
                        unit: 'hour'
                    },
                    display: true,
                    text: "Time (24-HR) | Date"
                },
                y: {                    
                    precision: 0,
                    beginAtZero: true
                    
                }
            }
        }
    });
}
// End of Code Adapted