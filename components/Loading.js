import { Circle } from "better-react-spinkit"

function Loading() {
    return (
        <center style={{ display: "grid", placeItems: "center", height: '100vh' }}>
            <div>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Whatsapp_logo.svg/911px-Whatsapp_logo.svg.png"
                    alt=""
                    style={{marginBottom:10}}
                    height="200"
                />
                <Circle color="black" size={60}/>
            </div>
        </center>
    )
}

export default Loading
