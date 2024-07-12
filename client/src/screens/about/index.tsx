import {
  Box,
  Container,
  IconButton,
  styled,
  Divider as SubDivider,
  Typography,
} from "@mui/material";
import { LinkedIn } from "@mui/icons-material";
import developmentSvg from "../../assets/development.svg";

const Divider = styled(SubDivider)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export default function About() {
  const openLinkedin = () => {
    window.location.href = "https://www.linkedin.com/in/kunalagrawal24/";
  };

  return (
    <Container>
      <Typography variant="h6" sx={{ mt: 2 }}>
        About Project
      </Typography>
      <Divider />
      <Typography variant="subtitle1">
        Chatterbox: Building a Real-Time Chat Platform (In Development)
      </Typography>
      <Typography component={"p"} variant="body1">
        Chatterbox is a real-time chat application currently under development.
        It aims to provide a platform for users to connect and have engaging
        conversations. Here's a glimpse into the progress made so far:
      </Typography>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <img src={developmentSvg} width={300} />
      </Container>
      <Typography variant="subtitle1">Frontend Features:</Typography>
      <ul style={{ listStyle: "inside" }}>
        <li>
          <Typography component={"span"}>
            Implemented a user interface with Material UI for a clean and
            consistent design aesthetic.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Integrated features like user authentication using Firebase and a
            hero SVG banner.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Enabled a smooth user experience with a sticky message box form,
            resembling a mobile chat app.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Added autocomplete functionality using MUI to simplify triggering
            the LLM assistant.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Incorporated user avatars to visually distinguish regular users from
            the AI assistant, "Chatterbot."
          </Typography>
        </li>
      </ul>
      <Typography variant="subtitle1">Backend Functionality:</Typography>
      <ul style={{ listStyle: "inside" }}>
        <li>
          <Typography component={"span"}>
            Containerized the backend service ("chatterbox-service") using
            Docker for improved code maintainability and deployment.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Migrated the application from a virtual machine (VM) to Cloud Run
            for automatic scaling, built-in security, and developer-friendly
            integration with Socket.io.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Established real-time communication between server and client using
            Socket.io, enabling features like displaying active user count.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Leveraged Pub/Sub in Redis for real-time message updates.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Integrated the Gemini Flash LLM model via Langchain, allowing users
            to interact with an AI assistant by prefacing messages with
            "chatterbot:".
          </Typography>
        </li>
      </ul>
      <Typography variant="subtitle1">Use Cases:</Typography>
      <Typography>
        Chatterbox can be used for various scenarios, including:
      </Typography>
      <ul style={{ listStyle: "inside" }}>
        <li>
          <Typography component={"span"}>
            Casual conversations with friends and family.
          </Typography>
        </li>
        <li>
          <Typography component={"span"}>
            Online communities and discussion groups.
          </Typography>
        </li>
      </ul>
      <Typography>
        Casual conversations with friends and family. Online communities and
        discussion groups. Educational purposes, where users can interact with
        an AI assistant for information or clarification. Customer support,
        potentially using AI chatbots for basic inquiries. Constant Development:
        It's important to note that Chatterbox is under active development. This
        post highlights some key milestones reached so far, but new features and
        functionalities are continuously being added.
        <br />
        <b>Stay Tuned!</b>
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Socials
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", columnGap: 2, alignItems: "center" }}>
        <IconButton onClick={openLinkedin}>
          <LinkedIn color="primary" />
        </IconButton>
        <Typography component={"p"} variant="body1">
          So the project development can be followed on LinkedIn, all updates
          contains a hashtag <b>#chatterbox</b>
        </Typography>
      </Box>
      {/* <Typography variant="h6" sx={{ mt: 2 }}>
        Project Features
      </Typography>
      <Divider />
      <Typography component={"p"} variant="body1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
        deserunt accusamus voluptatibus, aperiam voluptas, libero, quam iusto
        totam assumenda unde beatae quasi vero saepe numquam. Ab vitae repellat
        neque architecto modi. Explicabo doloremque omnis sunt cum dignissimos
        delectus ipsa dolorum repellat, eaque quod est distinctio voluptatibus
        ipsum error itaque assumenda incidunt molestiae quo in eius doloribus
        commodi. Id, quibusdam vero! Ab, excepturi odio. Omnis soluta eius
        molestiae quidem ea ut quos aspernatur, deleniti reprehenderit! Odit
        modi eligendi molestiae perferendis labore, quibusdam numquam, tenetur
        omnis, expedita minima accusamus amet. Omnis saepe numquam natus.
        Perspiciatis facere voluptates, dolorem numquam ab maiores recusandae?
      </Typography> */}
      {/* <Typography variant="h6" sx={{ mt: 2 }}>
        Project Timeline
      </Typography>
      <Divider />
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Sleep</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
      </Timeline> */}
      <Box sx={{ height: 100 }}></Box>
    </Container>
  );
}
