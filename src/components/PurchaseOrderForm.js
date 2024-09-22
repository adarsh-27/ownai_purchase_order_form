import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import data from "../data.json"
import { RiDeleteBin6Line } from "react-icons/ri";

const PurchaseOrderForm = () => {

    const [clientsData, setClientsData] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [jobTitles, setJobTitles] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema), defaultValues: {
            currency: 'USD'
        }
    },)

    const { fields, append, remove, replace, update } = useFieldArray({
        control,
        name: 'talentDetails'
    })

    useEffect(() => {
        setClientsData(data.clients);
    }, []);

    const watchPoType = watch('poType')

    const onSubmit = (data) => {
        console.log('Form Data:', data);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        reset();
        setSelectedClient(null);
        setJobTitles([]);
        replace([]);
        setIsSubmitted(false)
    };

    const handleClientChange = (e) => {
        const clientName = e.target.value;
        const client = clientsData.find((c) => c.name === clientName);
        if (client) {
            setSelectedClient(client);
            setJobTitles(client.jobTitles);

            // it will create a new object of job title and job id for everytime the client was changed
            replace([]);

            if (client?.jobTitles?.length > 0) {
                append({ jobTitle: "", reqId: '', talents: [] });
            }
        } else {
            setSelectedClient(null);
            setJobTitles([]);
        }
    };

    const handleJobTitleChange = (e, index) => {
        const jobTitle = e.target.value;
        const job = jobTitles.find((j) => j.name === jobTitle);
        if (job) {
            update(index, {
                jobTitle: job.name,
                reqId: job.reqId,
                talents: job.talents.map(talent => talent.name)
            });
        } else {
            update(index, {
                jobTitle: '',
                reqId: '',
                talents: []
            });
        }
    };

    const handleAddAnother = () => {
        append({ jobTitle: "", reqId: '', talents: [] });
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
                                    <Form.Control as="select" {...register('clientName')} onChange={handleClientChange} disabled={isSubmitted}>
                                        <option value="">Select Client</option>
                                        {clientsData.map((client, index) => (
                                            <option key={index} value={client.name}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    {errors.clientName && <p className="text-danger">{errors.clientName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="poType">
                                    <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Purchase Order Type <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="select" {...register('poType')} disabled={isSubmitted}>
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
                                    <Form.Control type="text" placeholder='PO Number' {...register('poNumber')} disabled={isSubmitted} />
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
                                            <Form.Control type="date" placeholder='Received On' {...field} disabled={isSubmitted} />
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
                                    <Form.Control type="text" placeholder='Received From Name' {...register('receivedFromName')} disabled={isSubmitted} />
                                    {errors.receivedFromName && <p className="text-danger">{errors.receivedFromName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="receivedFromEmail">
                                    <Form.Label className='mb-3'></Form.Label>
                                    <Form.Control type="email" placeholder='Received From Email ID' {...register('receivedFromEmail')} disabled={isSubmitted} />
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
                                                    <Form.Control type="date" {...field} disabled={isSubmitted} />
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
                                                    <Form.Control type="date" {...field} disabled={isSubmitted} />
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
                                            <Form.Control type="number" placeholder='Budget' {...register('budget')} disabled={isSubmitted} />
                                            {errors.budget && <p className="text-danger">{errors.budget.message}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="currency">
                                            <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Currency <span className="text-danger">*</span></Form.Label>
                                            <Form.Control as="select" {...register('currency')} disabled={isSubmitted}>
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

                        <div className='d-flex justify-content-between bg-light align-items-center'>
                            <h5 className="mt-1">Talent Detail</h5>
                            {watchPoType === "Group" &&
                                <Button variant="border border-dark btn btn-sm rounded-pill bg-white fw-bolder" onClick={() => handleAddAnother()}>
                                    + Add Another
                                </Button>
                            }
                        </div>
                        <hr />

                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="mb-3">
                                    <Row className='d-flex align-items-center'>

                                        <Col md={3}>
                                            <Form.Group controlId={`jobTitle_${index}`}>
                                                <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Job Title/REQ Name <span className="text-danger">*</span></Form.Label>
                                                <Form.Control as="select" {...register(`talentDetails.${index}.jobTitle`)} onChange={(e) => handleJobTitleChange(e, index)} disabled={isSubmitted}>

                                                    <option value="">Select Job Title</option>
                                                    {jobTitles.map((job, i) => (
                                                        <option key={i} value={job.name}>
                                                            {job.name}
                                                        </option>
                                                    ))}

                                                </Form.Control>
                                            </Form.Group>
                                        </Col>

                                        <Col md={3}>
                                            <Form.Group controlId={`reqId_${index}`}>
                                                <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Job ID/REQ ID <span className="text-danger">*</span></Form.Label>
                                                <Form.Control type="text" value={fields[index]?.reqId || ''} readOnly className="bg-light" />
                                            </Form.Group>
                                        </Col>


                                        <Col md={6} className="text-end">
                                            <RiDeleteBin6Line onClick={() => remove(index)} role='button' />
                                        </Col>

                                    </Row>

                                    <hr />

                                    {fields[index]?.talents?.length > 0 && fields[index].talents.map((talent, tIndex) => (
                                        <Row key={tIndex}>
                                            <Row key={tIndex} className="align-items-center mb-2">
                                                <Col md={2} className='d-flex fw-bolder'>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={talent}
                                                        {...register(`talentDetails.${index}.talent.${tIndex}`)}
                                                        disabled={isSubmitted}
                                                    />
                                                </Col>
                                            </Row>
                                            <div className='d-flex gap-3'>
                                                <Col md={3}>
                                                    <Form.Group controlId="poNumber">
                                                        <Form.Label className='d-flex gap-1 fw-bolder mb-0'>Contract Duration</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder='Contract Duration'
                                                            {...register('Contract Duration')}
                                                            disabled={isSubmitted} />
                                                        {errors.poNumber && <p className="text-danger">{errors.poNumber.message}</p>}
                                                    </Form.Group>
                                                </Col>

                                                <div className='d-flex gap-2'>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className='d-flex mb-0'>Bill Rate</Form.Label>
                                                            <Form.Control type="text" placeholder="Bill Rate ($)" disabled={isSubmitted} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="currency">
                                                            <Form.Label className='d-flex mb-0'>Currency</Form.Label>
                                                            <Form.Control as="select" {...register('currency', { value: 'USD' })} disabled={isSubmitted}>
                                                                <option value="USD">USD - Dollars($)</option>
                                                                <option value="EUR">EUR - Euro(€)</option>
                                                            </Form.Control>
                                                            {errors.currency && <p className="text-danger">{errors.currency.message}</p>}
                                                        </Form.Group>
                                                    </Col>
                                                </div>

                                                <div className='d-flex gap-2'>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className='d-flex mb-0'>Standard Time</Form.Label>
                                                            <Form.Control type="text" placeholder="Standard Time BR ($)" disabled={isSubmitted} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="currency">
                                                            <Form.Label className='d-flex mb-0'>Currency</Form.Label>
                                                            <Form.Control as="select" {...register('currency')} disabled={isSubmitted}>
                                                                <option value="">Select Currency</option>
                                                                <option value="USD">USD - Dollars($)</option>
                                                                <option value="EUR">EUR - Euro(€)</option>
                                                            </Form.Control>
                                                            {errors.currency && <p className="text-danger">{errors.currency.message}</p>}
                                                        </Form.Group>
                                                    </Col>
                                                </div>

                                                <div className='d-flex gap-2'>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label className=' d-flex mb-0'>Over Time</Form.Label>
                                                            <Form.Control type="text" placeholder="Over Time BR ($)" disabled={isSubmitted} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="currency">
                                                            <Form.Label className='d-flex mb-0'>Currency</Form.Label>
                                                            <Form.Control as="select" {...register('currency')} disabled={isSubmitted}>
                                                                <option value="">Select Currency</option>
                                                                <option value="USD">USD - Dollars($)</option>
                                                                <option value="EUR">EUR - Euro(€)</option>
                                                            </Form.Control>
                                                            {errors.currency && <p className="text-danger">{errors.currency.message}</p>}
                                                        </Form.Group>
                                                    </Col>
                                                </div>
                                            </div>
                                        </Row>
                                    ))}

                                </div>
                            )
                        })}

                        <div className='d-flex justify-content-end gap-3'>
                            <Button variant="outline-dark" onClick={handleReset} className="rounded-pill">
                                Reset
                            </Button>
                            <Button variant="outline-success" type="submit" className='rounded-pill'>
                                Submit
                            </Button>
                        </div>

                    </Form>
                </Card.Body>
            </Card>
        </Container >
    )
}

export default PurchaseOrderForm