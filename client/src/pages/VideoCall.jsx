// VideoCall.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChat";

export default function VideoCall() {
        const { chatId } = useParams();
        const navigate = useNavigate();
        const { user } = useAuth();
        const { data: chats = [] } = useChats();

        const chat = chats.find((c) => c.id === parseInt(chatId));
        const partner = chat?.participant1?.id === user?.id ? chat?.participant2 : chat?.participant1;

        const localVideoRef = useRef(null);
        const remoteVideoRef = useRef(null);
        const peer = useRef(null);
        const socket = useRef(null);
        const localStream = useRef(null);

        const [micOn, setMicOn] = useState(true);
        const [cameraOn, setCameraOn] = useState(true);
        const [callStatus, setCallStatus] = useState("Инициализация...");

        useEffect(() => {
                const isInitiator = user?.id && partner?.id && user.id < partner.id;
                const protocol = window.location.protocol === "https:" ? "wss" : "ws";
                const token = localStorage.getItem("accessToken");
                const socketUrl = `${protocol}://localhost:8000/ws/video/${chatId}/?token=${token}`;

                socket.current = new WebSocket(socketUrl);

                socket.current.onopen = () => console.log("🔌 WebSocket открыт");
                socket.current.onerror = (e) => setCallStatus("Ошибка соединения");
                socket.current.onclose = () => setCallStatus("Соединение закрыто");

                socket.current.onmessage = async (event) => {
                        const data = JSON.parse(event.data);
                        if (!peer.current) return;

                        switch (data.type) {
                                case "offer":
                                        await peer.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                                        const answer = await peer.current.createAnswer();
                                        await peer.current.setLocalDescription(answer);
                                        socket.current.send(JSON.stringify({ type: "answer", answer }));
                                        setCallStatus("Соединение установлено");
                                        break;
                                case "answer":
                                        await peer.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                                        setCallStatus("Соединение установлено");
                                        break;
                                case "ice":
                                        try {
                                                await peer.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                                        } catch (err) {
                                                console.error("ICE error:", err);
                                        }
                                        break;
                        }
                };

                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                        localStream.current = stream;
                        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                        peer.current = new RTCPeerConnection({
                                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                        });

                        peer.current.onicecandidate = (event) => {
                                if (event.candidate) {
                                        socket.current.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
                                }
                        };

                        peer.current.ontrack = (event) => {
                                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
                        };

                        stream.getTracks().forEach((track) => peer.current.addTrack(track, stream));

                        if (isInitiator) {
                                peer.current.onnegotiationneeded = async () => {
                                        const offer = await peer.current.createOffer();
                                        await peer.current.setLocalDescription(offer);
                                        socket.current.send(JSON.stringify({ type: "offer", offer }));
                                        setCallStatus("Ожидание ответа...");

                                        const chatSocketProtocol = window.location.protocol === "https:" ? "wss" : "ws";
                                        const chatSocket = new WebSocket(`${chatSocketProtocol}://localhost:8000/ws/chat/${chatId}/?token=${token}`);
                                        chatSocket.onopen = () => {
                                                chatSocket.send(
                                                        JSON.stringify({
                                                                type: "call",
                                                                call: "start",
                                                                from_user_name: `${user.first_name} ${user.last_name}`,
                                                        })
                                                );
                                                chatSocket.close();
                                        };
                                };
                        } else {
                                setCallStatus("Ожидание приглашения...");
                        }
                });

                return () => {
                        socket.current?.close();
                        peer.current?.close();
                        localStream.current?.getTracks().forEach((track) => track.stop());
                };
        }, [chatId]);

        const endCall = () => {
                socket.current?.close();
                peer.current?.close();
                localStream.current?.getTracks().forEach((track) => track.stop());
                navigate(`/chat/${chatId}`);
        };

        const toggleMic = () => {
                const audioTrack = localStream.current?.getAudioTracks()?.[0];
                if (audioTrack) {
                        audioTrack.enabled = !audioTrack.enabled;
                        setMicOn(audioTrack.enabled);
                }
        };

        const toggleCamera = () => {
                const videoTrack = localStream.current?.getVideoTracks()?.[0];
                if (videoTrack) {
                        videoTrack.enabled = !videoTrack.enabled;
                        setCameraOn(videoTrack.enabled);
                }
        };

        return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6 p-4">
                        <div className="flex flex-col items-center space-y-2">
                                <h1 className="text-xl font-semibold">
                                        Видеозвонок с {partner ? `${partner.first_name} ${partner.last_name}` : "пользователем"}
                                </h1>
                                <div className="text-sm text-gray-400">{callStatus}</div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-center">
                                <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-gray-800 rounded-lg" />
                                <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-gray-800 rounded-lg" />
                        </div>

                        <div className="flex gap-4">
                                <button onClick={toggleMic} className={`px-4 py-2 rounded ${micOn ? "bg-green-600" : "bg-gray-600"}`}>
                                        {micOn ? "Микрофон ВКЛ" : "Микрофон ВЫКЛ"}
                                </button>
                                <button onClick={toggleCamera} className={`px-4 py-2 rounded ${cameraOn ? "bg-green-600" : "bg-gray-600"}`}>
                                        {cameraOn ? "Камера ВКЛ" : "Камера ВЫКЛ"}
                                </button>
                                <button onClick={endCall} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
                                        Завершить звонок
                                </button>
                        </div>
                </div>
        );
}
