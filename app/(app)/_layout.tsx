import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { UserDto } from "@/dto/UserDto";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import { storageUserGet } from "@/storage/storageUser";
import { router, Slot } from "expo-router";
import React, { useEffect, useState } from "react";

export default function AppLayout() {
  const { isLoading } = useAuth();
  const [user, setUser] = useState({} as UserDto);
  const { isVisible } = useHeader();

  useEffect(() => {
    async function checkUser() {
      try {
        const session = await storageUserGet();

        if (!session) router.replace("/login");

        setUser(session?.user as UserDto);
      } catch (error) {
        router.replace("/login");
      }
    }

    checkUser();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <HeaderProvider>
      {isVisible && <Header user={user} />}
      <Slot />
    </HeaderProvider>
  );
}
