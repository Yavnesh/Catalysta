"use client"

import * as z from "zod";
import axios from "axios";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const ChatPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        try{
            const userMessage = {
                role: "user",
                content: values.prompt,
            };

            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/chat", {
                messages: newMessages,
            });

            console.log("response")
            console.log(response.data)

            const responseToAdd = {"role" : "Catalysta", "content": response.data}

            setMessages((current) => [...current, userMessage, responseToAdd]);

            console.log("messages")
            console.log(messages)

            form.reset();

        }catch (error){
            console.log(error);
        }finally{
            router.refresh();
        }
    }


    return (
        <div>
            <Heading
                title="Chat"
                description="Our most advanced chat tool"
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                                <FormField
                                    name="prompt"
                                    render={({field}) => (
                                        <FormItem className="col-span-12 lg:col-span-10">
                                            <FormControl className="m-0 p-0">
                                                <Input 
                                                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                    disabled={isLoading}
                                                    placeholder="How to solve trigonometry questions?"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                    Generate
                                </Button>
                            </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading &&(
                        <div className="p-8 rounded-lg w-full items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No chat started" />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div key={message.content} className={cn(
                                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                            )}>
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                {message.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;