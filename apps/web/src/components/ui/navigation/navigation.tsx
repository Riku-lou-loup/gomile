interface Props{}
import Typography from "../design-system/typography";
import Container from "../elements/container";
import {Logo} from "@/components/Logo/Logo";
const style1 = "flex items-center justify-between py-1.5 bg-primary h-6 sm:h-12 lg:h-22";
export const Navigation = ({}: Props) => {
    return (
        <Container className={style1} fullwidth={true}> { /*à verifier*/}
            <div className = "px-10">
                <Logo size="md"/>
            </div>
            <div>
                <Typography className="flex items-center gap-4" theme = "white" weight = "medium" variant = "span">
                    <span>À PROPOS</span>
                    <span>CONTACT</span>
                </Typography>
            </div>    
        </Container>
    )
}