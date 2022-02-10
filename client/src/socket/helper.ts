import { InitAppWithSockets } from "./index"

interface initSocketOnceProps {
    initializedSocket: boolean;
    initSocket(value: boolean): void;
    user: {
        id: number;
    }; 
}

export const initSocketOnce = (props: initSocketOnceProps) => {
    const { initializedSocket, initSocket, user } = props;
    if(!initializedSocket && !!user.id){
        import("./socket")
            .then(module => {
                const socket = module.socket;
                const InitAppInstance = new InitAppWithSockets(socket, user);
                InitAppInstance.init().then(() => {
                    initSocket(true);
                    // socket.emit("go-online", user.id);
                })
            })
            .catch(error => console.log(error))
    }else{
        return false
    }
}