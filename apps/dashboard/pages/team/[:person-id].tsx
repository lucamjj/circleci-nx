import React from 'react';
import useSWR, { mutate } from 'swr';
import { makeStyles } from '@material-ui/core/styles';
import MeetingCard from '../../components/MeetingCard';
import { useRouter } from 'next/router';
import GridCards from '../../components/GridCards';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Add from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { ButtonLink } from '../../components/ButtonLink';
import RichTextEditor from '../../components/RichTextEditor';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import UsePostData from '../../utils/UsePostData';
import { AxiosResponse } from 'axios';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '100px',
    height: '100px',
  },
  userRow: {
    margin: '0 0 50px 0',
  },
  accordion: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: theme.palette.warning.light,
  },
}));

const PersonPage = () => {
  const { query } = useRouter();
  const personId = query[':person-id'];
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const { data, error } = useSWR(
    `http://localhost:3333/api/people/${personId}`
  );

  const { data: deleteStatus, API } = UsePostData();

  const calculateMeetingsData = React.useCallback(
    (meetings) =>
      Object.entries(meetings).reduce((prev, [meetingId, meetingInfo]) => {
        return [
          ...prev,
          {
            personId,
            meetingId,
            meetingInfo,
          },
        ];
      }, []),
    [personId]
  );

  const updateListOfMeetings = async (meetingId) => {
    const newData = { ...data };

    delete newData['meetings'][meetingId];

    const res = (await API.DELETE({
      url: `http://localhost:3333/api/people/${personId}/meetings/${meetingId}`,
      content: { personId, meetingId },
    })) as AxiosResponse;

    if (res && res.status && res.status === 200) {
      mutate(
        `http://localhost:3333/api/people/${personId}`,
        {
          ...data,
          ...newData,
        },
        false
      );
    } else if (res && res.status !== 200) {
      console.log("Delete didn't work, sorry");
    }
  };

  if (error) return <div>failed to load person</div>;
  if (!data) return <div>loading person info...</div>;

  const handleChange = (panel: string) => (
    event: React.ChangeEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { bio, notes } = data;

  return (
    <>
      <Grid container item xs={12} spacing={4} className={classes.userRow}>
        <Grid item>
          <Avatar
            alt={`picture of ${bio.name}`}
            src={bio.pic}
            className={classes.avatar}
          />
        </Grid>
        <Grid item container xs={6}>
          <Grid item xs={12}>
            <Typography variant={'h3'} component={'h1'}>
              {bio.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body2'} component={'p'} paragraph>
              Joined the company on: {bio.joinDate}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body1'} component={'p'}>
              Role: {bio.role}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Accordion
          expanded={expanded === 'panelInfo'}
          onChange={handleChange('panelInfo')}
          className={classes.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography variant={'h6'} component={'h2'}>
              Info
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table aria-label="custom pagination table">
                <TableBody>
                  {Object.entries(bio).map(([key, value]) => (
                    <TableRow key={Math.random()}>
                      <TableCell component="th" scope="row">
                        <Typography variant={'body1'}>{key}</Typography>
                      </TableCell>
                      <TableCell align="left">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panelNotes'}
          onChange={handleChange('panelNotes')}
          className={classes.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography variant={'h6'} component={'h2'}>
              Notes
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              style={{
                padding: '20px',
              }}
            >
              <RichTextEditor
                origin={`http://localhost:3333/api/people/${personId}`}
                content={notes}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panelMeetings'}
          onChange={handleChange('panelMeetings')}
          className={classes.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography variant={'h6'} component={'h2'}>
              Meetings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <Grid
                item
                style={{
                  padding: '20px 0',
                }}
              >
                <ButtonLink
                  variant="contained"
                  className={classes.actionButton}
                  startIcon={<Add />}
                  href={{
                    pathname: `/team/${personId}/meetings/new`,
                    query: {
                      id: personId,
                    },
                  }}
                >
                  Add Meeting
                </ButtonLink>
              </Grid>
              <Grid
                container
                item
                style={{
                  padding: '20px 0',
                }}
              >
                <GridCards
                  cardComponent={MeetingCard as React.FC}
                  data={calculateMeetingsData(data.meetings)}
                  cols={2}
                  updateListOfMeetings={updateListOfMeetings}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default PersonPage;
