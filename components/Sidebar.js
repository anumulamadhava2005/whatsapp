import {Avatar, Button, IconButton} from "@material-ui/core"
import styled from "styled-components"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from "@material-ui/icons/Search"
import * as EmailValidator from "email-validator"
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../firebase";
import Chat from "./Chat";


function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () =>{
        const input = prompt(
            "Please enter an email adress for the user you wish to chat with"
        );

        if (!input) return null;

        if (
            EmailValidator.validate(input) && 
            !chatAlreadyExists(input) 
            && input !== user.email
        ) {
            db.collection('chats').add({
                users: [user.email, input]
            })
        }
    };

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(
            (chat) =>
             chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );
    

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>

            <SearchField>
                <Search>
                    <SearchIcon/>
                    <SearchInput placeholder="search in chats" />
                </Search>
            </SearchField>
            
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}

        </Container>
    );
}

export default Sidebar;


const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 90vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
`;

const ChatButton = styled.div`
    padding: 10px;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    color: white;
    border-radius: 30px;
    padding: 5px;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const SearchField = styled.div`
    background-color: rgb(246,246,246);
    margin-top: 0;
    padding: 15px;
`;

const Search = styled.div`
    display: flex;
    position: sticky;
    border: 1px solid whitesmoke;
    border-radius: 30px;
    background-color: white;
    padding: 10px;
    align-items: center;
`;

const SearchInput = styled.input`
    border: none;
    outline-width: 0;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: rgb(237,237,237);
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: -0.8;
    }
`;

const IconsContainer = styled.div``;