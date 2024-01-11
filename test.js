const firestore = require("./config.js");
const data1 = { "name": "Pragar", "surname": "Kholia", "college": "DAIICT", "rank": 1 };
const ref = firestore.collection("TestData");


// Store Data in Firestore
async function createUser() {
    try {
        await firestore.collection("TestData").add(data1);
        console.log("Data Saved");
    } catch (error) {
        console.log("The error", error);
    }
}
// createUser();

// Update data in firestore
async function updateUser() {

    const fieldRef = ref.doc("KAepdM9X7psIjPcW5TBC");
    await fieldRef.update({ "college": "Nirma" });
    console.log("Data Updated")
}
// updateUser();

// Delete data in firestore
async function deleteData() {
    try {
        await ref.doc("Kmip92dBBIXPJdHtcuhA").delete();
        console.log("Data Deleted");
    } catch (error) {
        console.log("Error :", error)
    }
}
// deleteData();


// Data getting method 
async function getData() {
    try {
        const cityRef = ref.doc("KAepdM9X7psIjPcW5TBC");
        const doc = await cityRef.get();

        if (!doc) {
            console.log("No data found!!")
        } else {
            console.log("The Data:", doc.data())
        }
    } catch (error) {
        console.log(error);
    }
}
// getData();


// Query all data
async function getAllUsers() {
    try {
        const snapshot = await ref.where("college", "==", "LDRP").get(); // this wil fetch query

        if (snapshot.empty) {
            console.log("No data found")
        }
        let users = {};
        snapshot.forEach(doc => {
            users[doc.id] = { "userId": doc.id, ...doc.data() };
            console.log(doc.id, "== ", doc.data());
        })
        console.log(users)
    } catch (error) {
        console.log(error);
    }
}
getAllUsers();


// Using And Operator
async function usedAnd() {
    try {

        const snapshot = await ref.where("college", "==", "DAIICT").where("rank", "==", 1).get(); // this wil fetch query

        if (snapshot.empty) {
            console.log("No data found")
        }

        snapshot.forEach(doc => {
            console.log(doc.id, "==", doc.data());
        })
    } catch (error) {
        console.log(error);
    }
}

// usedAnd();

// Using Or Operator
async function usedLimitClause() {
    try {

        // this is limit clause
        const snapshot = await ref.orderBy("name").limit(4).get();
        if (snapshot.empty) {
            console.log("No data found")
        }

        snapshot.forEach(doc => {
            console.log(doc.id, "==", doc.data());
        })
    } catch (error) {

        console.log(error)
    }
}
// usedLimitClause();

// This is the aggergate function in firestore

async function usedAggergate() {
    try {
        const sumAggregateQuery = ref.aggregate({
            totalPopulation: AggregateField.sum('rank'),
        });
        const snapshot = await sumAggregateQuery.get();
        if (snapshot.empty) {
            console.log("No data found")
        }

        snapshot.forEach(doc => {
            console.log(doc.id, "==", doc.data());
        })
    } catch (error) {
        console.log(error)
    }
}

// usedAggergate();