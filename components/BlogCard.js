import { Card, createStyles, Image, Text } from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  blogCard: {
    transition: "all 0.5s",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[1],
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
}));

const BlogCard = ({
  blogUrl,
  coverImage,
  title,
  description,
  readable_publish_date,
}) => {
  const { classes } = useStyles();
  return (
    <Link href={`${blogUrl}`} target="_blank">
      <Card p="lg" radius="lg" className={classes.blogCard}>
        <Card.Section>
          <Image
            src={coverImage}
            radius="lg"
            width="100%"
            fit="cover"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Text weight={500}>{title}</Text>

        <Text size="sm" color="dimmed">
          {description}
        </Text>

        <Text size="sm">{readable_publish_date}</Text>
      </Card>
    </Link>
  );
};
export default BlogCard;