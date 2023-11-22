import "../../index.css";

export function DeleteChat({ _id }) {
    async function onDelete() {
        const res = await fetch(`http://localhost:3000/api/chats/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            console.log("yeeey you deleted a message");
        } else {
            console.log("something went wrong" + res.statusCode);
        }
    }

    return (
        <div className={"delete-btn"}>
            <button onClick={onDelete}>delete</button>
        </div>
    );
}