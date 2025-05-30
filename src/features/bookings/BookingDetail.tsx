import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import { PerBooking } from './types';
import { useNavigate } from 'react-router-dom';
import { HiArrowUpOnSquare } from 'react-icons/hi2';
import { useCheckout } from '../check-in-out/useCheckout';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { deleteBooking } from '../../services/apiBookings';
import { useDeleteBooking } from './useDeleteBooking';
import Empty from '../../ui/Empty';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

type Status = 'unconfirmed' | 'checked-in' | 'checked-out';

type StatusToTagName = {
  [key in Status]: string;
};

const statusToTagName: StatusToTagName = {
  unconfirmed: 'blue',
  'checked-in': 'green',
  'checked-out': 'silver'
};

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { status, id: bookingId } = (booking ?? {}) as {
    status: Status;
    id: string | number;
  };
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;
  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      {booking && <BookingDataBox booking={booking as PerBooking} />}

      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}
        {status === 'checked-in' && (
          <Button
            onClick={() => checkout({ bookingId: Number(bookingId) })}
            disabled={isCheckingOut}
          >
            <HiArrowUpOnSquare style={{ marginRight: '0.5rem' }} /> Check out
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">delete booking</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeleting}
              onConfirm={() =>
                deleteBooking(Number(bookingId), {
                  onSettled: () => navigate(-1)
                })
              }
            />
          </Modal.Window>
        </Modal>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
