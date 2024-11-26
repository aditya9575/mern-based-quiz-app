import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { IoStarHalfSharp } from "react-icons/io5";
import styles from './aboutus.module.css';

const AboutUsPage = () => {
    return (
        <Container className={`${styles.aboutPage} text-center`}>
            <Row className="justify-content-center">
                <Col xs={12} md={8}>
                    <IoStarHalfSharp className={styles.icon} />
                    <h1 className={styles.title}>About Quizzy</h1>
                    <p className={styles.description}>
                        Welcome to **Quizzy**! We are a platform dedicated to helping students from grades 7-10
                        test and enhance their knowledge through engaging and adaptive quizzes. At Quizzy, we believe
                        in empowering students by providing a personalized learning experience tailored to their
                        strengths and areas of improvement.
                    </p>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12} md={4}>
                    <Card className={styles.card}>
                        <Card.Body>
                            <Card.Title>Engaging Content</Card.Title>
                            <Card.Text>
                                Our quizzes are crafted to make learning fun and interactive, covering a variety of topics like Algebra, Geometry, and more.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className={styles.card}>
                        <Card.Body>
                            <Card.Title>Adaptive Learning</Card.Title>
                            <Card.Text>
                                With our Computerized Adaptive Testing (CAT), each quiz adapts to your performance, ensuring an optimal challenge.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className={styles.card}>
                        <Card.Body>
                            <Card.Title>Detailed Feedback</Card.Title>
                            <Card.Text>
                                Get detailed performance reports and personalized improvement suggestions to help you excel.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUsPage;
