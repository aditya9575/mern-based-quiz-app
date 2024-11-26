import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./contact-us.module.css";

const ContactUsPage = () => {
    return (
        <Container className={`${styles.contactPage} text-center`}>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.description}>
                Reach out to us for any queries or collaborations! We'd love to hear from you.
            </p>
            <Row className={styles.iconRow}>
                <Col xs={6} md={3} className={styles.iconCol}>
                    <a
                        href="https://www.linkedin.com/in/aditya-m-0bb92b110/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
                    >
                        <FaLinkedin className={`${styles.icon} ${styles.linkedin}`} />
                        <p>LinkedIn</p>
                    </a>
                </Col>
                <Col xs={6} md={3} className={styles.iconCol}>
                    <a
                        href="https://github.com/aditya9575"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
                    >
                        <FaGithub className={`${styles.icon} ${styles.github}`} />
                        <p>GitHub</p>
                    </a>
                </Col>
                <Col xs={6} md={3} className={styles.iconCol}>
                    <a
                        href="https://x.com/AdityaMehto3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
                    >
                        <FaSquareXTwitter className={`${styles.icon} ${styles.twitter}`} />
                        <p>Twitter</p>
                    </a>
                </Col>
                <Col xs={6} md={3} className={styles.iconCol}>
                    <a
                        href="mailto:adityamehto19@gmail.com"
                        className={styles.iconLink}
                    >
                        <MdOutgoingMail className={`${styles.icon} ${styles.email}`} />
                        <p>Email</p>
                    </a>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUsPage;
