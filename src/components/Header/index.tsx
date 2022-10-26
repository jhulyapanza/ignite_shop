import Image from "next/future/image";
import logoImg from "../../assets/logo.svg";
import Link from "next/link";
import { HeaderContainer } from "./styles";
import {Cart} from "../Cart";
import {useRouter} from "next/router";

export function Header(){
    const { pathname } = useRouter();
    const showCartButton = pathname !== '/success';
    return(
        <HeaderContainer>
            <Link href="/">
                    <Image src={logoImg} alt="" />
            </Link>
            {showCartButton && <Cart/>}
        </HeaderContainer>

    )
}