import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./FirebaseConfig";

async function getCities() {
    const snap = await getDocs(collection(db, "cities"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export default function Firebase() {
    useEffect(() => {
        getCities().then(console.log);
    }, []);

    return <div>Firebase</div>;
}