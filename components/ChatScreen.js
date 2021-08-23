import { Avatar, IconButton, Input } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { auth, db } from "../firebase";
import AttachFileIcon from "@material-ui/icons/AttachFile"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import Message from "./Message";
import { useState } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"
import { useRef } from "react";

function ChatScreen({ chat, messages  }) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const endOfMessagesRef = useRef(null);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy('timestamp','asc')
    );

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user) )
    )

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message key={message.id} user={messages.user} message={message} />
            ))
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    const sendMessage = (e) =>{
        e.preventDefault();

        db.collection("users").doc(user.uid).set(
        {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoUrl: user.photoURL,
        });

        setInput('');
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoUrl}/>
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot? (
                        <p>Last Active: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                        ) : "Unavailable"}
                        </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <InputField>
                    <InsertEmoticonIcon />
                    <InputText value={input} onChange={e => setInput(e.target.value)} />
                    <button hidden disabled={!input} type="submit" onClick={sendMessage}>
                         Send Message 
                    </button>
                    <MicIcon />
                </InputField>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``;

const InputText = styled.input`
    border: none;
    outline-width: 0;
    margin-left: 5px;
    flex: 1;
`;

const InputField = styled.div`
    display: flex;
    position: sticky;
    border: 1px solid whitesmoke;
    border-radius: 30px;
    background-color: white;
    padding: 10px;
    align-items: center;
`;

const InputContainer = styled.form`
    position: sticky;
    background-color: rgb(237,237,237);
    z-index:100;
    top:0;
    padding: 15px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const Header = styled.div`
    position: sticky;
    background-color: rgb(237,237,237);
    z-index:100;
    top:0;
    display: flex;
    padding: 15px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 79vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;