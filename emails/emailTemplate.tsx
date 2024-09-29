import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Font,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username = "Anindya",
  otp = "000000",
}: VerificationEmailProps) {

  // copy otp to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(otp).then(() => {
      alert('OTP copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy OTP:', err);
    });
  };




  return (
    <Html>
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Misty-message</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={company}>Mistry-message</Text>
          <Heading style={codeTitle}>
            Hello {username},<br />
            <span>
              {" "}
              Thank you for registering.
            </span>
          </Heading>
          <Text style={codeDescription}>Please use the following verification
          code to complete your registration:</Text>
          <Section style={codeContainer}>
            <Heading style={codeStyle}>{otp}</Heading>
          </Section>
          
          <Section style={buttonContainer}>
            <Button style={button} onClick={copyToClipboard}>
              Copy
            </Button>
          </Section>
          <Text style={{color:"#444"}}>
            Enter it in your open browser window or press the sign in button.
            This code will expire in 15 minutes.
          </Text>
          <Text style={paragraph}>Not expecting this email?</Text>
          <Text style={paragraph}>
            Contact{" "}
            <Link href="mailto:support@misty.com" style={link}>
              support@misty.com
            </Link>{" "}
            if you did not request this code.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  marginTop: "20px",
  width: "480px",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "12% 6%",
};

const company = {
  fontWeight: "bold",
  fontSize: "25px",
  textAlign: "center" as const,
};

const codeTitle = {
  textAlign: "center" as const,
  fontSize: "20px",
  marginTop: "50px",
};

const codeDescription = {
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
  maxWidth: "100%",
};

const codeStyle = {
  color: "#000",
  display: "inline-block",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
  letterSpacing: "8px",
};

const buttonContainer = {
  margin: "20px auto",
  width: "auto",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  textAlign: "center" as const,
  padding: "12px 24px",
  margin: "0 auto",
  cursor:"pointer"
  
};

const paragraph = {
  color: "#444",
  letterSpacing: "0",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#00308f",
  textDecoration: "underline",
};
