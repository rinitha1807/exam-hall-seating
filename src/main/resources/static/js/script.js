document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       LOAD ALL DATA
       ========================================================= */

    loadDashboardCounts();

    loadHalls();

    loadStudents();

    loadExams();

    loadSeats();

    loadAllocations();


    /* =========================================================
       SETUP ALL FORMS
       ========================================================= */

    setupHallForm();

    setupStudentForm();

    setupExamForm();

    setupSeatForm();

    setupSeatingPage();

});


/* =========================================================
   DASHBOARD
   ========================================================= */

async function loadDashboardCounts() {

    try {

        const hallsResponse =
            await fetch("/halls");

        const studentsResponse =
            await fetch("/students");

        const examsResponse =
            await fetch("/exam-sessions");

        const allocationsResponse =
            await fetch("/allocations");


        const halls =
            await hallsResponse.json();

        const students =
            await studentsResponse.json();

        const exams =
            await examsResponse.json();

        const allocations =
            await allocationsResponse.json();


        const hallCount =
            document.getElementById("hallCount");

        const studentCount =
            document.getElementById("studentCount");

        const examCount =
            document.getElementById("examCount");

        const allocationCount =
            document.getElementById("allocationCount");


        if (hallCount) {

            hallCount.textContent =
                halls.length;

        }


        if (studentCount) {

            studentCount.textContent =
                students.length;

        }


        if (examCount) {

            examCount.textContent =
                exams.length;

        }


        if (allocationCount) {

            allocationCount.textContent =
                allocations.length;

        }


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


/* =========================================================
   HALL MANAGEMENT
   ========================================================= */

function setupHallForm() {

    const form =
        document.getElementById("hallForm");


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const hall = {

                hallName:
                    document.getElementById("hallName").value,

                rows:
                    Number(
                        document.getElementById("hallRows").value
                    ),

                columns:
                    Number(
                        document.getElementById("hallColumns").value
                    ),

                capacity:
                    Number(
                        document.getElementById("hallCapacity").value
                    )

            };


            try {

                const response =
                    await fetch("/halls", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(hall)

                    });


                if (response.ok) {

                    showMessage(
                        "hallMessage",
                        "Hall added successfully!",
                        "success"
                    );


                    form.reset();


                    loadHalls();

                    loadDashboardCounts();

                } else {

                    showMessage(
                        "hallMessage",
                        "Unable to add hall.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);


                showMessage(
                    "hallMessage",
                    "Server connection failed.",
                    "error"
                );

            }

        }
    );

}


async function loadHalls() {

    try {

        const response =
            await fetch("/halls");


        if (!response.ok) {

            throw new Error(
                "Failed to load halls"
            );

        }


        const halls =
            await response.json();


        const tableBody =
            document.getElementById(
                "hallTableBody"
            );


        /*
         * Display halls in Hall Management
         */

        if (tableBody) {

            tableBody.innerHTML = "";


            if (halls.length === 0) {

                tableBody.innerHTML = `

                    <tr>

                        <td colspan="6">

                            No halls available

                        </td>

                    </tr>

                `;

            } else {

                halls.forEach(function (hall) {

                    tableBody.innerHTML += `

                        <tr>

                            <td>
                                ${hall.id}
                            </td>

                            <td>
                                ${hall.hallName}
                            </td>

                            <td>
                                ${hall.rows}
                            </td>

                            <td>
                                ${hall.columns}
                            </td>

                            <td>
                                ${hall.capacity}
                            </td>

                            <td>

                                <button
                                    class="delete-btn"
                                    onclick="deleteHall(${hall.id})">

                                    Delete

                                </button>

                            </td>

                        </tr>

                    `;

                });

            }

        }


        /*
         * Load halls into dropdowns
         */

        loadHallOptions(halls);


    } catch (error) {

        console.error(
            "Hall loading error:",
            error
        );

    }

}


function loadHallOptions(halls) {

    /*
     * Seating Arrangement hall dropdown
     */

    const seatingHall =
        document.getElementById(
            "seatingHall"
        );


    if (seatingHall) {

        seatingHall.innerHTML = `

            <option value="">
                Select a hall
            </option>

        `;


        halls.forEach(function (hall) {

            seatingHall.innerHTML += `

                <option value="${hall.id}">

                    ${hall.hallName}

                </option>

            `;

        });

    }


    /*
     * Seat Management hall dropdown
     */

    const seatHall =
        document.getElementById(
            "seatHall"
        );


    if (seatHall) {

        seatHall.innerHTML = `

            <option value="">
                Select a hall
            </option>

        `;


        halls.forEach(function (hall) {

            seatHall.innerHTML += `

                <option value="${hall.id}">

                    ${hall.hallName}

                </option>

            `;

        });

    }

}


async function deleteHall(id) {

    if (
        !confirm(
            "Are you sure you want to delete this hall?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/halls/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            loadHalls();

            loadDashboardCounts();

        } else {

            alert(
                "Unable to delete hall."
            );

        }


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   STUDENT MANAGEMENT
   ========================================================= */

function setupStudentForm() {

    const form =
        document.getElementById(
            "studentForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const student = {

                rollNumber:
                    document.getElementById(
                        "rollNumber"
                    ).value,

                name:
                    document.getElementById(
                        "studentName"
                    ).value,

                classSection:
                    document.getElementById(
                        "classSection"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        "/students",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(student)

                        }
                    );


                if (response.ok) {

                    showMessage(
                        "studentMessage",
                        "Student added successfully!",
                        "success"
                    );


                    form.reset();


                    loadStudents();

                    loadDashboardCounts();

                } else {

                    showMessage(
                        "studentMessage",
                        "Unable to add student.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);


                showMessage(
                    "studentMessage",
                    "Server connection failed.",
                    "error"
                );

            }

        }
    );

}


async function loadStudents() {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    if (!tableBody) {

        return;

    }


    try {

        const response =
            await fetch(
                "/students"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load students"
            );

        }


        const students =
            await response.json();


        tableBody.innerHTML = "";


        if (students.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No students available

                    </td>

                </tr>

            `;

            return;

        }


        students.forEach(function (student) {

            tableBody.innerHTML += `

                <tr>

                    <td>
                        ${student.id}
                    </td>

                    <td>
                        ${student.rollNumber}
                    </td>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.classSection}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Student loading error:",
            error
        );

    }

}


async function deleteStudent(id) {

    if (
        !confirm(
            "Are you sure you want to delete this student?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            loadStudents();

            loadDashboardCounts();

        } else {

            alert(
                "Unable to delete student."
            );

        }


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   EXAM MANAGEMENT
   ========================================================= */

function setupExamForm() {

    const form =
        document.getElementById(
            "examForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const exam = {

                examName:
                    document.getElementById(
                        "examName"
                    ).value,

                examDate:
                    document.getElementById(
                        "examDate"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        "/exam-sessions",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(exam)

                        }
                    );


                if (response.ok) {

                    showMessage(
                        "examMessage",
                        "Exam added successfully!",
                        "success"
                    );


                    form.reset();


                    loadExams();

                    loadDashboardCounts();

                } else {

                    showMessage(
                        "examMessage",
                        "Unable to add exam.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);


                showMessage(
                    "examMessage",
                    "Server connection failed.",
                    "error"
                );

            }

        }
    );

}


async function loadExams() {

    try {

        const response =
            await fetch(
                "/exam-sessions"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load exams"
            );

        }


        const exams =
            await response.json();


        const tableBody =
            document.getElementById(
                "examTableBody"
            );


        if (tableBody) {

            tableBody.innerHTML = "";


            if (exams.length === 0) {

                tableBody.innerHTML = `

                    <tr>

                        <td colspan="4">

                            No exams available

                        </td>

                    </tr>

                `;

            } else {

                exams.forEach(function (exam) {

                    tableBody.innerHTML += `

                        <tr>

                            <td>
                                ${exam.id}
                            </td>

                            <td>
                                ${exam.examName}
                            </td>

                            <td>
                                ${exam.examDate}
                            </td>

                            <td>

                                <button
                                    class="delete-btn"
                                    onclick="deleteExam(${exam.id})">

                                    Delete

                                </button>

                            </td>

                        </tr>

                    `;

                });

            }

        }


        /*
         * Load exams into seating dropdown
         */

        loadExamOptions(exams);


    } catch (error) {

        console.error(
            "Exam loading error:",
            error
        );

    }

}


function loadExamOptions(exams) {

    const select =
        document.getElementById(
            "seatingExam"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select an exam
        </option>

    `;


    exams.forEach(function (exam) {

        select.innerHTML += `

            <option value="${exam.id}">

                ${exam.examName} - ${exam.examDate}

            </option>

        `;

    });

}


async function deleteExam(id) {

    if (
        !confirm(
            "Are you sure you want to delete this exam?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/exam-sessions/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            loadExams();

            loadDashboardCounts();

        } else {

            alert(
                "Unable to delete exam."
            );

        }


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   SEAT MANAGEMENT
   ========================================================= */

function setupSeatForm() {

    const form =
        document.getElementById(
            "seatForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const hallId =
                document.getElementById(
                    "seatHall"
                ).value;


            if (!hallId) {

                showMessage(
                    "seatMessage",
                    "Please select a hall.",
                    "error"
                );

                return;

            }


            const seat = {

                seatNumber:
                    document.getElementById(
                        "seatNumber"
                    ).value,

                rowNumber:
                    Number(
                        document.getElementById(
                            "seatRow"
                        ).value
                    ),

                columnNumber:
                    Number(
                        document.getElementById(
                            "seatColumn"
                        ).value
                    ),

                hall: {

                    id: Number(hallId)

                }

            };


            try {

                const response =
                    await fetch(
                        "/seats",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(seat)

                        }
                    );


                if (response.ok) {

                    showMessage(
                        "seatMessage",
                        "Seat added successfully!",
                        "success"
                    );


                    form.reset();


                    loadSeats();

                } else {

                    showMessage(
                        "seatMessage",
                        "Unable to add seat.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);


                showMessage(
                    "seatMessage",
                    "Server connection failed.",
                    "error"
                );

            }

        }
    );

}


async function loadSeats() {

    const tableBody =
        document.getElementById(
            "seatTableBody"
        );


    if (!tableBody) {

        return;

    }


    try {

        const response =
            await fetch(
                "/seats"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load seats"
            );

        }


        const seats =
            await response.json();


        tableBody.innerHTML = "";


        if (seats.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="6">

                        No seats available

                    </td>

                </tr>

            `;

            return;

        }


        seats.forEach(function (seat) {

            /*
             * Seat.java currently uses @JsonIgnore
             * for the hall field.
             */

            const hallName =
                seat.hall
                    ? seat.hall.hallName
                    : "-";


            tableBody.innerHTML += `

                <tr>

                    <td>
                        ${seat.id}
                    </td>

                    <td>
                        ${hallName}
                    </td>

                    <td>
                        ${seat.seatNumber}
                    </td>

                    <td>
                        ${seat.rowNumber}
                    </td>

                    <td>
                        ${seat.columnNumber}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteSeat(${seat.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Seat loading error:",
            error
        );

    }

}


async function deleteSeat(id) {

    if (
        !confirm(
            "Are you sure you want to delete this seat?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/seats/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            loadSeats();

        } else {

            alert(
                "Unable to delete seat."
            );

        }


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   AUTOMATIC SEATING ARRANGEMENT
   ========================================================= */

function setupSeatingPage() {

    const button =
        document.getElementById(
            "generateButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async function () {

            const exam =
                document.getElementById(
                    "seatingExam"
                ).value;


            const hall =
                document.getElementById(
                    "seatingHall"
                ).value;


            /*
             * Check exam
             */

            if (!exam) {

                showMessage(
                    "seatingMessage",
                    "Please select an exam.",
                    "error"
                );

                return;

            }


            /*
             * Check hall
             */

            if (!hall) {

                showMessage(
                    "seatingMessage",
                    "Please select a hall.",
                    "error"
                );

                return;

            }


            /*
             * Show loading message
             */

            showMessage(
                "seatingMessage",
                "Generating seating arrangement...",
                "success"
            );


            /*
             * Disable button
             */

            button.disabled = true;

            button.textContent =
                "Generating...";


            try {

                /*
                 * Call Spring Boot backend
                 *
                 * POST
                 * /allocations/generate
                 */

                const response =
                    await fetch(
                        `/allocations/generate?examId=${exam}&hallId=${hall}`,
                        {
                            method: "POST"
                        }
                    );


                /*
                 * Get response text first.
                 *
                 * This prevents JSON parsing errors
                 * if Spring Boot returns an error.
                 */

                const responseText =
                    await response.text();


                let data;


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    data = null;

                }


                /*
                 * Check backend response
                 */

                if (!response.ok) {

                    let errorMessage =
                        "Unable to generate seating arrangement.";


                    if (data && data.message) {

                        errorMessage =
                            data.message;

                    } else if (responseText) {

                        errorMessage =
                            responseText;

                    }


                    throw new Error(
                        errorMessage
                    );

                }


                /*
                 * Display generated seating
                 */

                displayGeneratedSeating(
                    data
                );


                /*
                 * Success message
                 */

                showMessage(
                    "seatingMessage",
                    "Seating arrangement generated successfully!",
                    "success"
                );


                /*
                 * Refresh allocation data
                 */

                loadAllocations();

                loadDashboardCounts();


            } catch (error) {

                console.error(
                    "Seating generation error:",
                    error
                );


                showMessage(
                    "seatingMessage",
                    error.message ||
                    "Unable to generate seating arrangement.",
                    "error"
                );


                /*
                 * Hide result when generation fails
                 */

                const result =
                    document.getElementById(
                        "generationResult"
                    );


                if (result) {

                    result.style.display =
                        "none";

                }

            } finally {

                /*
                 * Enable button again
                 */

                button.disabled = false;

                button.textContent =
                    "🪑 Generate Seating Arrangement";

            }

        }
    );

}


/* =========================================================
   DISPLAY GENERATED SEATING
   ========================================================= */

function displayGeneratedSeating(
    allocations
) {

    const result =
        document.getElementById(
            "generationResult"
        );


    const tableBody =
        document.getElementById(
            "generatedSeatingBody"
        );


    if (!result || !tableBody) {

        return;

    }


    /*
     * Clear old seating
     */

    tableBody.innerHTML = "";


    /*
     * Check generated allocations
     */

    if (
        !allocations ||
        allocations.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No seating arrangement was generated.

                </td>

            </tr>

        `;


        result.style.display =
            "block";


        return;

    }


    /*
     * Sort seats by row and column
     */

    allocations.sort(
        function (a, b) {

            const rowA =
                a.seat
                    ? a.seat.rowNumber
                    : 0;


            const rowB =
                b.seat
                    ? b.seat.rowNumber
                    : 0;


            if (rowA !== rowB) {

                return rowA - rowB;

            }


            const columnA =
                a.seat
                    ? a.seat.columnNumber
                    : 0;


            const columnB =
                b.seat
                    ? b.seat.columnNumber
                    : 0;


            return columnA - columnB;

        }
    );


    /*
     * Display every allocation
     */

    allocations.forEach(
        function (allocation) {

            const seat =
                allocation.seat;


            const student =
                allocation.student;


            /*
             * Skip incomplete allocation
             */

            if (!seat || !student) {

                return;

            }


            tableBody.innerHTML += `

                <tr>

                    <td>

                        <strong>
                            ${seat.seatNumber}
                        </strong>

                    </td>

                    <td>
                        ${seat.rowNumber}
                    </td>

                    <td>
                        ${seat.columnNumber}
                    </td>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.rollNumber}
                    </td>

                    <td>
                        ${student.classSection}
                    </td>

                </tr>

            `;

        }
    );


    /*
     * Show result
     */

    result.style.display =
        "block";

}


/* =========================================================
   SEAT ALLOCATION MANAGEMENT
   ========================================================= */

async function loadAllocations() {

    const tableBody =
        document.getElementById(
            "allocationTableBody"
        );


    if (!tableBody) {

        return;

    }


    try {

        const response =
            await fetch(
                "/allocations"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load allocations"
            );

        }


        const allocations =
            await response.json();


        tableBody.innerHTML = "";


        if (allocations.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="7">

                        No allocations available

                    </td>

                </tr>

            `;

            return;

        }


        allocations.forEach(
            function (allocation) {

                const examName =
                    allocation.examSession
                        ? allocation.examSession.examName
                        : "-";


                const studentName =
                    allocation.student
                        ? allocation.student.name
                        : "-";


                const classSection =
                    allocation.student
                        ? allocation.student.classSection
                        : "-";


                const seatNumber =
                    allocation.seat
                        ? allocation.seat.seatNumber
                        : "-";


                const hallName =
                    allocation.seat &&
                    allocation.seat.hall
                        ? allocation.seat.hall.hallName
                        : "-";


                tableBody.innerHTML += `

                    <tr>

                        <td>
                            ${allocation.id}
                        </td>

                        <td>
                            ${examName}
                        </td>

                        <td>
                            ${studentName}
                        </td>

                        <td>
                            ${classSection}
                        </td>

                        <td>
                            ${seatNumber}
                        </td>

                        <td>
                            ${hallName}
                        </td>

                        <td>

                            <button
                                class="delete-btn"
                                onclick="deleteAllocation(${allocation.id})">

                                Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


    } catch (error) {

        console.error(
            "Allocation loading error:",
            error
        );

    }

}


async function deleteAllocation(id) {

    if (
        !confirm(
            "Are you sure you want to delete this allocation?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/allocations/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (response.ok) {

            loadAllocations();

            loadDashboardCounts();

        } else {

            alert(
                "Unable to delete allocation."
            );

        }


    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   MESSAGE FUNCTION
   ========================================================= */

function showMessage(
    elementId,
    message,
    type
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.className =
        "message " + type;


    setTimeout(
        function () {

            element.textContent = "";

            element.className =
                "message";

        },
        3000
    );

}