import { Agent, run, tool } from "@openai/agents";
import axios from "axios";
import nodemailer from "nodemailer";
import z from "zod";


const getWeatherResultSchema = z.object({
    city: z.string().describe("name of the city"),
    conditon: z.string().describe("condition of the weather"),
    temperature: z.number().describe("temperature of the weather"),
})

const getWeatherTools = tool({
    name: "Weather Tool",
    description: "returns the current weather of a given city",
    parameters: z.object({
        city: z.string().describe("name of the city"),
    }),
    execute: async function({city}) {
        const url = `https://wttr.in/${city?.toLowerCase()}?format=%C+%t`
        const response = await axios.get(url)
        return `The Weather of ${city} is ${response.data}`
    },
})

const sendEmailTools = tool({
    name: "send_email",
    description: "This tool sends email an email",
    parameters: z.object({
        toEmail: z.string().describe("email address of receiver"),
        subject: z.string().describe("subject of email"),
        body: z.string().describe("body of email"),
    }),
    execute: async function({toEmail, subject, body}) {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",  // Use Gmail's SMTP server
                port: 465,
                secure: true,  // Use SSL
                auth: {
                    user: process.env.SMTP_USER,  // Your Gmail address
                    pass: process.env.SMTP_PASS,  // Your Gmail App Password (not regular password)
                },  
            });
            
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: toEmail,
                subject: subject,
                text: body,
            };
            
            await transporter.sendMail(mailOptions);
            return `Email sent successfully to ${toEmail}`;
        } catch (error) {
            console.error("Email error:", error.message);
            return `Failed to send email: ${error.message}`;
        }
    }
})
const agent = new Agent({
    name: "Weather Agent",
    instructions: "You are an expert weather agent that helps user to tell current weather",
    tools: [getWeatherTools, sendEmailTools],
    outputType: getWeatherResultSchema
})

async function main(query = '') {
    const result = await run(agent, query)
    console.log("Result: ", result.finalOutput)
}

main("What is the weather of delhi, new york, kerala? and then email the response to harshitadwivedi055@gmail.com with subject as testing from AI")
