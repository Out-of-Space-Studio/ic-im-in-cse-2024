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

const GENDER2TXT = {
    BOY: "男",
    GIRL: "女",
    NONBIN: "非二元性別",
};

const DIET2TXT = {
    NORMAL: "葷",
    VEGAN: "全素",
    VEGETARIAN: "蛋奶素",
    "OVO-VEGAN": "蛋素",
    "LACTO-VEGAN": "奶素",
    "NO-MEAT": "五辛素",
};

const RELATION2TXT = {
    FATHER: "父",
    MOTHER: "母",
    GRANDFATHER: "爺爺/外公",
    GRANDMOTHER: "奶奶/外婆",
    OTHERS: "其他",
};

// datas to get
window.query = async function () {
    const form = document.getElementById("FORM");

    const fields = {
        SID: "學號",
        IDNumber: "身分證字號",
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

    if (!verifyId(form.IDNumber.value)) {
        alert(`身份證字號錯誤!`);
        setTimeout(() => {
            IDNumber.style.borderColor = "red";
            IDNumber.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            IDNumber.focus();
        }, 0);
        return;
    } else {
        IDNumber.style.borderColor = "";
    }

    const student = new Stu({
        sid: form.SID.value,
        idnumber: form.IDNumber.value,
    });

    await student.confirmInfo();
};

// db stuff
class Stu {
    constructor(studentData) {
        this.sid = studentData.sid;
        this.name = studentData.name;
        this.gender = studentData.gender;
        this.diet = studentData.diet;
        this.allergy = studentData.allergy;
        this.idnumber = studentData.idnumber;
        this.birth = studentData.birth;
        this.phoneNumber = studentData.phoneNumber;
        // this.clothingSize = studentData.clothingSize;
        this.emgName = studentData.emgName;
        this.emgRelation = studentData.emgRelation;
        this.emgPhoneNumber = studentData.emgPhoneNumber;
        if (this.sid[0].toLowerCase() === "s") {
            this.sid = this.sid.slice(1);
        }
    }

    async confirmInfo() {
        const isConfirm = window.confirm(
            "請確認以下資訊是否正確\n 學號：" +
                this.sid +
                "\n 身分證字號：" +
                this.idnumber
        );
        if (isConfirm) {
            await readUserData(this);
        } else {
            alert("你已取消查詢報名資料!");
        }
    }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    initializeAppCheck,
    ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

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

async function readUserData(stu) {
    const dbref = ref(getDatabase());
    get(child(dbref, `students/${stu.sid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const correctData = snapshot.val();
                console.log("Query Success");
                console.log(correctData);
                console.log(snapshot);
                if (stu.idnumber === correctData.IDNUMBER) {
                    console.log("Data correct.");
                    alert(
                        "以下資訊為您的報名資料\n 學號：" +
                            stu.sid +
                            "\n 姓名：" +
                            correctData.NAME +
                            "\n 性別：" +
                            GENDER2TXT[correctData.GENDER] +
                            "\n 葷素：" +
                            DIET2TXT[correctData.DIET] +
                            "\n 身分證字號：" +
                            correctData.IDNUMBER +
                            "\n 生日：" +
                            correctData.BIRTH +
                            "\n 聯絡電話：" +
                            correctData.PHONE +
                            // "\n 衣服尺寸：" +
                            // correctData.SIZE +
                            "\n 緊急聯絡人姓名：" +
                            correctData.EMGNAME +
                            "\n 與學員之關係：" +
                            RELATION2TXT[correctData.EMGRELATIONS] +
                            "\n 緊急聯絡人電話：" +
                            correctData.EMGPHONE
                    );
                    window.location.href = "../index.html";
                } else {
                    console.log("Data wrong.");
                    alert("學號或身分證字號錯誤");
                }
            } else {
                console.log("No data available");
                alert("找不到該學號的資料");
            }
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

// ID Verfication
function verifyId(id) {
    id = id.trim();
    const verification = id.match("^[A-Z][12]\\d{8}$");
    if (!verification) {
        return false;
    }

    let conver = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
    let weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

    id = String(conver.indexOf(id[0]) + 10) + id.slice(1);

    let checkSum = 0;
    for (let i = 0; i < id.length; i++) {
        const c = parseInt(id[i]);
        const w = weights[i];
        checkSum += c * w;
    }

    return checkSum % 10 == 0;
}
