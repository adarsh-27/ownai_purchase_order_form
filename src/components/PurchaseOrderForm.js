import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Button, Row, Col, Container, Card, Stack } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const PurchaseOrderForm = () => {

    const validationSchema = yup.object().shape({
        clientName: yup.string().required('Client Name is required'),
        poType: yup.string().required('Purchase Order Type is required'),
        poNumber: yup.string().required('Purchase Order Number is required'),
        receivedOn: yup.date().required('Received On Date is required').nullable(),
        receivedFromName: yup.string().required('Received From Name is required'),
        receivedFromEmail: yup.string().email('Invalid email').required('Received From Email is required'),
        poStartDate: yup.date().required('PO Start Date is required').nullable(),
        poEndDate: yup.date()
            .min(yup.ref('poStartDate'), 'PO End Date cannot be earlier than the PO Start Date')
            .required('PO End Date is required').nullable(),
        budget: yup
            .number()
            .typeError('Budget must be a number')
            .positive('Budget must be a positive number')
            .max(99999, 'Budget cannot exceed 5 digits')
            .required('Budget is required'),
        currency: yup.string().required('Currency is required'),
    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({ resolver: yupResolver(validationSchema) })


    const onSubmit = (data) => {
        console.log('Form Data:', data);
    };

    const handleReset = () => {
        reset();
    };

    return (
        <Container>
            <Card className='my-5'>

                <Card.Header className="text-black">
                    <h4>Purchase Order Form</h4>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>

                        <h5 className="text-muted">Purchase Order Details</h5>
                        <hr />

                        <Row className='mb-3'>
                            <Col md={3}>
                                <Form.Group controlId="clientName">
                                    <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Client Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="select" {...register('clientName')}>
                                        <option value="">Select Client</option>
                                        <option value="Client A">Client A</option>
                                        <option value="Client B">Client B</option>
                                    </Form.Control>
                                    {errors.clientName && <p className="text-danger">{errors.clientName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="poType">
                                    <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Purchase Order Type <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="select" {...register('poType')}>
                                        <option value="">Select PO Type</option>
                                        <option value="Group">Group PO</option>
                                        <option value="Individual">Individual PO</option>
                                    </Form.Control>
                                    {errors.poType && <p className="text-danger">{errors.poType.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="poNumber">
                                    <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Purchase Order Number <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder='PO Number' {...register('poNumber')} />
                                    {errors.poNumber && <p className="text-danger">{errors.poNumber.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="receivedOn">
                                    <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Received On <span className="text-danger">*</span></Form.Label>
                                    <Controller
                                        control={control}
                                        name="receivedOn"
                                        render={({ field }) => (
                                            <Form.Control type="date" placeholder='Received On' {...field} />
                                        )}
                                    />
                                    {errors.receivedOn && <p className="text-danger">{errors.receivedOn.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col md={3}>
                                <Form.Group controlId="receivedFromName">
                                    <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Received From Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" placeholder='Received From Name' {...register('receivedFromName')} />
                                    {errors.receivedFromName && <p className="text-danger">{errors.receivedFromName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="receivedFromEmail">
                                    <Form.Label className='mb-3'></Form.Label>
                                    <Form.Control type="email" placeholder='Received From Email ID' {...register('receivedFromEmail')} />
                                    {errors.receivedFromEmail && <p className="text-danger">{errors.receivedFromEmail.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="poStartDate">
                                            <Form.Label className='d-flex gap-1 fw-bolder mb-0'>PO Start Date <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                control={control}
                                                name="poStartDate"
                                                render={({ field }) => (
                                                    <Form.Control type="date" {...field} />
                                                )}
                                            />
                                            {errors.poStartDate && <p className="text-danger">{errors.poStartDate.message}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="poEndDate">
                                            <Form.Label className='d-flex gap-1 fw-bolder mb-0'>PO End Date <span className="text-danger">*</span></Form.Label>
                                            <Controller
                                                control={control}
                                                name="poEndDate"
                                                render={({ field }) => (
                                                    <Form.Control type="date" {...field} />
                                                )}
                                            />
                                            {errors.poEndDate && <p className="text-danger">{errors.poEndDate.message}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="budget">
                                            <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Budget <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="number" placeholder='Budget' {...register('budget')} />
                                            {errors.budget && <p className="text-danger">{errors.budget.message}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="currency">
                                            <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Currency <span className="text-danger">*</span></Form.Label>
                                            <Form.Control as="select" {...register('currency')}>
                                                <option value="">Select Currency</option>
                                                <option value="USD">USD - Dollars($)</option>
                                                <option value="EUR">EUR - Euro(€)</option>
                                            </Form.Control>
                                            {errors.currency && <p className="text-danger">{errors.currency.message}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* <Stack direction='horizontal' gap={3}> */}
                        <div className='d-flex justify-content-end gap-3'>
                            <Button variant="outline-dark" onClick={handleReset} className="rounded-pill">
                                Reset
                            </Button>
                            <Button variant="outline-success" type="submit" className='rounded-pill'>
                                Submit
                            </Button>
                        </div>
                        {/* </Stack> */}

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default PurchaseOrderForm