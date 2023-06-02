import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card'
import SkeletonLoad from './SkeletonLoad'
import Grid from '@mui/material/Grid'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>

            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export default function PlayerStatTabs({ id, p }) {
    const [value, setValue] = React.useState(0);
    const [pastSevenStats, setPastSevenStats] = React.useState([])
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    console.log(id)
    const fetchPastSevenStats = async () => {
        // main_home needs: teams, standings, news
        try {
            const response = await fetch(`http://127.0.0.1:4444/pastSevenStats?id=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            console.log(jsonData)
            setPastSevenStats(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const statPanels = { 'Batting Average': 'avg', 'On Base': 'obp', 'On Plate': 'ops', 'Slugging': 'slg' }
    React.useEffect(() => {
        fetchPastSevenStats()
    }, [])


    if (pastSevenStats.length != 0) console.log(pastSevenStats)
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Card>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {
                            Object.keys(statPanels).map((tabName, iter) => {
                                return (
                                    <Tab key={tabName} label={tabName} {...a11yProps(iter)} />
                                )
                            })
                        }
                    </Tabs>
                </Card>
            </Box>
            {
                pastSevenStats.length == 0 ?
                    <Grid container justifyContent="center"><SkeletonLoad /></Grid>
                    :
                    <>
                        <TabPanel value={value} index={0}>
                            <LineChart width={476} height={200} data={pastSevenStats.reverse()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line connectNulls type="monotone" dataKey="data.people[0].stats[0].splits[0].stat.avg" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            Item Two
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Item Three
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            Item 4
                        </TabPanel>
                    </>
            }
        </Box>
    )
}
