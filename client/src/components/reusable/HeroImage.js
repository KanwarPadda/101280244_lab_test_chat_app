import { 
    Grid,
    Box,
    Typography,
    makeStyles
 } from "@material-ui/core"

import { ReactComponent as Bubble } from "../../assets/images/bubble.svg"
import BgImage from "../../assets/images/bg-img.png"

const useStyles = makeStyles({
    grid: {
        position: "relative",
        background: `url(${BgImage}) no-repeat`,
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        display: props => props.isXs ? "none" : "initial"
    },
    layer: {
      background: "linear-gradient(#3A8DFF, #86B9FF)",
      opacity: "85%",
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    svgStyles: {
      zIndex: 9,
      textAlign: "center", 
      marginBottom: "2rem"
    },
    imageTypo: {
      zIndex: 10,
      color: "white"
    }
})

const HeroImage = (props) => {
    const classes = useStyles(props);
    return (
        <Grid item md={4} className={classes.grid}>
            <div className={classes.layer}></div>
            <Box
            display="grid"
            alignItems="center"
            justifyContent="center"
            mt={25}
            mx="auto"
            >
            <div className={classes.svgStyles}>
                <Bubble/>
            </div>
            <Typography display="block" className={classes.imageTypo} variant="h4" component="h1" align="center">
                Converse with anyone <Box marginTop="0.5rem" component="span" display="block">with any language</Box>
            </Typography>
            </Box>
        </Grid>
    )
}

export default HeroImage