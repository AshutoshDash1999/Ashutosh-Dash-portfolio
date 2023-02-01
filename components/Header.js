import {
  Avatar,
  Center,
  Container,
  createStyles,
  Image,
  keyframes,
} from "@mantine/core";
import AshuProfilePic from "public/profile-pic.png";
import BannerImg from "public/banner1.png"

const bgColorTransition = keyframes({
  from: {
    background: "#ef4444",
  },
  "5%": {
    background: "#f97316",
  },
  "10%": {
    background: "#f59e0b",
  },
  "15%": {
    background: "#eab308",
  },
  "20%": {
    background: "#84cc16",
  },
  "25%": {
    background: "#22c55e",
  },
  "30%": {
    background: "#10b981",
  },
  "35%": {
    background: "#14b8a6",
  },
  "40%": {
    background: "#22d3ee",
  },
  "45%": {
    background: "#38bdf8",
  },
  "50%": {
    background: "#60a5fa",
  },
  "55%": {
    background: "#6366f1",
  },
  "60%": {
    background: "#8b5cf6",
  },
  "65%": {
    background: "#a855f7",
  },
  "70%": {
    background: "#d946ef",
  },
  "75%": {
    background: "#db2777",
  },
  to: {
    background: "#f43f5e",
  },
});

const useStyles = createStyles((theme) => ({
  container: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    marginTop: "0.5rem",
    overflow: "hidden",
    animation: `${bgColorTransition} 15s ease-in-out infinite`,
  },
  banner: {
    borderRadius: theme.radius.md,
    background: "red",
  },
  avatar: {
    position: "absolute",
    top: "-5rem",
    height: "160px",
    width: "160px",
    borderRadius: "50%",
    transition: "all 0.5s",
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      height: "130px",
      width: "130px",
    },
  },
}));

const Header = () => {
  const { classes } = useStyles();

  return (
    <div>
      <Container size="xl" className={classes.container}>
        <Image
          className={classes.banner}
          radius="md"
          src={BannerImg.src}
          alt="Banner image"
          width="100%"
          height="200px"
          fit="cover"
          withPlaceholder
        />
      </Container>

      <Center
        sx={() => ({
          position: "relative",
          paddingBottom: "5rem",
        })}
      >
        <Avatar className={classes.avatar} src={AshuProfilePic.src} />
      </Center>
    </div>
  );
};
export default Header;
