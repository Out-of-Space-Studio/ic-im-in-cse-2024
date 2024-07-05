// BTT btn
document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.getElementById("back-to-top");

    if (!backToTopButton) {
        console.error("Back to top button not found in the DOM");
        return;
    }

    // Function to check scroll position and show/hide button
    function toggleBackToTopButton() {
        if (window.scrollY > 300 || window.pageYOffSet > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }

    // Function to scroll to top
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Throttle function to limit how often a function can fire
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // Add scroll event listener with throttling
    window.addEventListener("scroll", throttle(toggleBackToTopButton, 100));

    // Add click event listener to the button
    backToTopButton.addEventListener("click", scrollToTop);

    // Initial check to see if button should be displayed
    toggleBackToTopButton();

    console.log("Back to top button functionality initialized");
});

// datas to set
window.check_form = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        SID: "學號",
        NAME: "姓名",
        GENDER: "性別",
        DIET: "飲食習慣",
        ALLERGY: "過敏食物",
        IDNumber: "身分證字號",
        BIRTH: "生日",
        phoneNumber: "電話",
        CLOTHINGSIZE: "衣服尺寸",
        ICEName: "緊急聯絡人姓名",
        ICERelationship: "與緊急聯絡人關係",
        ICEPhoneNumber: "緊急聯絡人電話",
    };

    let emptyFields = [];
    let firstEmptyField = null;

    for (let [id, label] of Object.entries(fields)) {
        const field = form[id];
        if (!field.value) {
            emptyFields.push(label);
            field.style.borderColor = "red";
            if (!firstEmptyField) {
                firstEmptyField = field;
            }
        } else {
            field.style.borderColor = "";
        }
    }

    if (emptyFields.length > 0) {
        alert(`請填寫以下必填欄位：\n${emptyFields.join("\n")}`);
        setTimeout(() => {
            if (firstEmptyField) {
                firstEmptyField.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                firstEmptyField.focus();
            }
        }, 0);
        return;
    }

    const student = new Stu(
        form.SID.value,
        form.NAME.value,
        form.GENDER.value,
        form.DIET.value,
        form.ALLERGY.value,
        form.IDNumber.value,
        form.BIRTH.value,
        form.phoneNumber.value,
        form.CLOTHINGSIZE.value,
        form.ICEName.value,
        form.ICERelationship.value,
        form.ICEPhoneNumber.value
    );

    await student.confirmInfo();
};

// db stuff
class Stu {
    constructor(
        sid,
        name,
        gender,
        diet,
        allergy,
        idnumber,
        birth,
        phoneNumber,
        clothingSize,
        emgName,
        emgRelation,
        emgPhoneNumber
    ) {
        this.sid = sid;
        this.name = name;
        this.gender = gender;
        this.diet = diet;
        this.allergy = allergy;
        this.idnumber = idnumber;
        this.birth = birth;
        this.phoneNumber = phoneNumber;
        this.clothingSize = clothingSize;
        this.emgName = emgName;
        this.emgRelation = emgRelation;
        this.emgPhoneNumber = emgPhoneNumber;
    }

    async confirmInfo() {
        const isConfirm = window.confirm(
            "請確認以下資訊是否正確\n 學號：" +
                this.sid +
                "\n 姓名：" +
                this.name +
                "\n 性別：" +
                this.gender +
                "\n 葷素：" +
                this.diet +
                "\n 身分證字號：" +
                this.idnumber +
                "\n 生日：" +
                this.birth +
                "\n 聯絡電話：" +
                this.phoneNumber +
                "\n 衣服尺寸：" +
                this.clothingSize +
                "\n 緊急聯絡人姓名：" +
                this.emgName +
                "\n 與緊急聯絡人關係：" +
                this.emgRelation +
                "\n 緊急聯絡人電話：" +
                this.emgPhoneNumber
        );
        console.log(isConfirm);
        console.log("checkpoint01");
        if (isConfirm) {
            await writeUserData(this);
        }
    }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPh9Hg4qFMyrP_7nchVGTvM-qQKSUa6JE",
    authDomain: "ic-im-in-cse-2024-48f2b.firebaseapp.com",
    databaseURL:
        "https://ic-im-in-cse-2024-48f2b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ic-im-in-cse-2024-48f2b",
    storageBucket: "ic-im-in-cse-2024-48f2b.appspot.com",
    messagingSenderId: "259899984268",
    appId: "1:259899984268:web:888b208395c19ffdd3aea9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
        "6LcUXgcqAAAAANUEME6erIMev4sWICtHskv78kWA"
    ),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
});

async function writeUserData(stu) {
    const db = getDatabase();
    set(ref(db, `/students/${stu.sid}`), {
        NAME: stu.name,
        GENDER: stu.gender,
        DIET: stu.diet,
        ALLERGY: stu.allergy,
        IDNUMBER: stu.idnumber,
        BIRTH: stu.birth,
        PHONE: stu.phoneNumber,
        SIZE: stu.clothingSize,
        EMGNAME: stu.emgName,
        EMGPHONE: stu.emgPhoneNumber,
        EMGRELATIONS: stu.emgRelation,
    })
        .then(function () {
            console.log("Data written successfully");
            alert("報名成功");
            window.location.href = "../index.html";
        })
        .catch(function (error) {
            console.error("Error writing data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}
