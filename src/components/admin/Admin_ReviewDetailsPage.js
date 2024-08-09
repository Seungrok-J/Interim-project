import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Card, Badge, Breadcrumb, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaTimes, FaRegEye, FaShareSquare, FaFlagCheckered } from 'react-icons/fa';

function ReviewDetailsPage() {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([
        { id: 1, name: '홍길동', position: 'Project Manager', department: 'Project Management', reviewStatus: '2/4' },
        { id: 2, name: '팀원2', position: 'FE', department: 'Design Team', reviewStatus: '3/4' },
        { id: 3, name: '팀원1', position: 'BE', department: 'Development', reviewStatus: '1/4' },
        { id: 4, name: '팀원3', position: 'Data Analysis', department: 'Data Team', reviewStatus: '4/4' },
        
    ]);
    const [reviewTitle, setReviewTitle] = useState('스마트인재개발원 핵심프로젝트 역량리뷰');

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await axios.get(`/api/reviews/${reviewId}/participants`);
                setParticipants(response.data);
            } catch (error) {
                console.error('Error fetching review details:', error);
                // 적절한 사용자 피드백 로직 추가
            }
        };

        fetchParticipants();
    }, [reviewId]);

    const handleBackToManagement = () => {
        navigate('/admin/review-management');
    };


    const viewParticipantDetails = (participantId) => {
        // 해당 참가자의 리뷰 세부사항 페이지로 이동
        navigate(`/admin/review/${reviewId}/participant/${participantId}`);
    };
    const handleShareReview = async () => {
        try {
            const response = await axios.post(`/api/reviews/${reviewId}/share`);
            console.log("Review shared successfully!", response.data);
            alert('리뷰가 성공적으로 공유되었습니다!');
        } catch (error) {
            console.error('Failed to share the review:', error);
            alert('리뷰 공유에 실패했습니다.');
        }
    };

    const handleEndReview = async () => {
        if (window.confirm("Are you sure you want to end this review?")) {
            try {
                const response = await axios.post(`/api/reviews/${reviewId}/end`);
                console.log("Review ended successfully!");
                alert('리뷰가 성공적으로 종료되었습니다!');
                navigate('/admin/review-management'); // 리뷰 관리 페이지로 이동
            } catch (error) {
                console.error('Failed to end the review:', error);
                alert('리뷰 종료에 실패했습니다.');
            }
        }
    };

    const calculatePercentage = (reviewStatus) => {
        const parts = reviewStatus.split('/');
        if (parts.length === 2) {
            const completed = parseInt(parts[0], 10);
            const total = parseInt(parts[1], 10);
            return Math.round((completed / total) * 100);
        }
        return 0;
    };

    return (
        <Container className="my-4" style={{ marginLeft: "48px", marginRight: '48px', padding: "48px", width: 'auto' }}>
            <Breadcrumb className="mb-3">
                <Breadcrumb.Item active style={{ fontSize: "25px" }}>{reviewTitle}</Breadcrumb.Item>
            </Breadcrumb>
            <Card className="shadow-sm">
                <Card.Header as="h5" className="bg-white d-flex justify-content-between align-items-center">
                    <Button variant="outline-danger" onClick={handleBackToManagement} className="me-2">
                        <FaTimes />
                    </Button>
                    <div>
                        <Button variant="success" onClick={handleShareReview} className="me-2">
                            <FaShareSquare /> Share
                        </Button>
                        <Button variant="danger" onClick={handleEndReview}>
                            <FaFlagCheckered /> End Review
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover className="table-borderless">
                        <thead className="text-secondary">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Review Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map(participant => (
                                <tr key={participant.id} style={{ cursor: 'pointer' }}>
                                    <td>{participant.name}</td>
                                    <td>{participant.position}</td>
                                    <td>{participant.department}</td>
                                    <td>
                                        <Badge bg="info">{participant.reviewStatus}</Badge>
                                        {' '}
                                        <Badge bg="success">{calculatePercentage(participant.reviewStatus)}%</Badge>
                                    </td>
                                    <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>View details</Tooltip>}
                                        >
                                            <Button variant="outline-primary" onClick={() => viewParticipantDetails(participant.id)}>
                                                <FaRegEye /> Details
                                            </Button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ReviewDetailsPage;
