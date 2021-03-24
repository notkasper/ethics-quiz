import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import shuffle from 'shuffle-array';
import termsString from './terms.js';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  fixedHeight: {
    minHeight: '300px',
    padding: '1rem',
  },
}));

const getRandomItemWithBlacklist = (items, blacklist) => {
  let found = false;
  let item;
  while (!found) {
    item = items[Math.floor(Math.random() * items.length)];
    if (blacklist) {
      if (item !== blacklist) {
        found = true;
      }
    } else {
      found = true;
    }
  }
  return item;
};

const Item = (props) => {
  const { item, options, next } = props;
  const classes = useStyles();

  const onClick = (selected) => {
    const correct = selected.value === item.value;
    next(correct);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {item.key}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Choose the right definition</Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '2rem' }}>
        {options.map((option) => {
          return (
            <Grid item xs={3} onClick={() => onClick(option)}>
              <Card>
                <CardActionArea>
                  <Paper className={classes.fixedHeight}>
                    <Typography variant="h5">{option.value}</Typography>
                  </Paper>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

function App() {
  const [terms, setTerms] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const process = () => {
    let split = termsString.split('\n\n');
    const newTerms = split.map((item) => {
      const [key, value] = item.split('\n');
      return {
        key,
        value,
      };
    });
    shuffle(newTerms);
    setTerms(newTerms);
  };

  useEffect(() => {
    setLoading(true);
    process();
    setLoading(false);
  }, []);

  const getItem = () => terms[index];

  const getOptions = () => {
    const options = [
      getItem(),
      getRandomItemWithBlacklist(terms, getItem()),
      getRandomItemWithBlacklist(terms, getItem()),
      getRandomItemWithBlacklist(terms, getItem()),
    ];
    shuffle(options);
    return options;
  };

  const onNext = (isCorrect) => {
    if (isCorrect) {
      setCorrect(correct + 1);
    }
    setIndex(index + 1);
  };

  if (loading || !terms.length) {
    return <p>loading</p>;
  }

  if (index >= terms.length) {
    return (
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ maxWidth: '80%', marginLeft: '10%', marginTop: '10%' }}
      >
        <Typography variant="h5">That was it!</Typography>
        <Typography variant="h5">{`You scored: ${correct}/${terms.length}`}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIndex(0);
            setCorrect(0);
          }}
        >
          Click to retry
        </Button>
      </Grid>
    );
  }

  const Progress = () => (
    <Grid container style={{ margin: '1rem 0' }}>
      <Grid item xs={4}>
        <Typography variant="h5">{`correct ${correct}/${index}`}</Typography>
      </Grid>
      <Grid item xs={4}>
        -
      </Grid>
      <Grid item xs={4} align="right">
        <Typography variant="h5">{`question ${index + 1}/${terms.length}`}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <div className="App">
      <header className="App-header"></header>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ maxWidth: '80%', marginLeft: '10%', marginTop: '10%' }}
      >
        <Progress />
        <Item item={getItem()} options={getOptions()} next={onNext} />
        <Progress />
      </Grid>
    </div>
  );
}

export default App;
