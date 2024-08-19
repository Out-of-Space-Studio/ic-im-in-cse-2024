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
        ACCOUNT: "帳號",
        PWD: "密碼",
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

    const user = new User({
        account: form.ACCOUNT.value,
        pwd: form.PWD.value,
    });

    await user.verify();
};
class User {
    constructor(userData) {
        this.account = userData.account;
        this.pwd = userData.pwd;
    }
    async verify() {
        checkAdminData(this);
    }
}
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
        this.emgName = studentData.emgName;
        this.emgRelation = studentData.emgRelation;
        this.emgPhoneNumber = studentData.emgPhoneNumber;
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

async function getUserData() {
    const dbref = ref(getDatabase());
    get(child(dbref, `students`))
        .then((snapshot) => {
            let students = [];
            snapshot.forEach((childSnapshot) => {
                students.push(childSnapshot.val());
                alert(childSnapshot.val());
            });
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

async function checkAdminData(user) {
    const dbref = ref(getDatabase());
    get(child(dbref, `admins/${user.account}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const correctData = snapshot.val();
                console.log("Query Success");
                console.log(correctData);
                console.log(snapshot);
                if (user.pwd === correctData.PWD) {
                    console.log("Login corrected.");
                    alert("登入成功");
                    getUserData();
                    // window.location.href = "../index.html";
                } else {
                    console.log("Data wrong.");
                    alert("帳號或密碼錯誤");
                }
            } else {
                console.log("No data available");
                alert("找不到該帳號的資料");
            }
        })
        .catch((error) => {
            console.error("Error reading data: ", error);
            alert("伺服器發生錯誤，請稍後再試\n錯誤訊息: " + error.message);
        });
}

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
