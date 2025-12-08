import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useData } from "../context";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof formSchema>;

interface EditProfileFormProps {
  onSuccess?: () => void;
}

export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const { user, setUser } = useData();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: "", // We don't have email in the current user object
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        name: data.name,
      }));

      setIsLoading(false);
      onSuccess?.();
    }, 1000);
  };

  return (
    <View style={styles.stack}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent style={styles.content}>
          <Controller
            control={form.control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Name"
                placeholder="Enter your name"
                value={value}
                onChangeText={onChange}
                error={form.formState.errors.name?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                error={form.formState.errors.email?.message}
              />
            )}
          />
        </CardContent>
        <CardFooter>
          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent style={styles.content}>
          <Input
            label="Current Password"
            placeholder="Enter current password"
            secureTextEntry
            autoComplete="password"
          />
          <Input
            label="New Password"
            placeholder="Enter new password"
            secureTextEntry
            autoComplete="password-new"
          />
          <Input
            label="Confirm New Password"
            placeholder="Re-enter new password"
            secureTextEntry
            autoComplete="password-new"
          />
        </CardContent>
        <CardFooter>
          <Button variant="outline" style={styles.button}>
            Save Password
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  content: {
    gap: 16,
  },
  button: {
    width: "100%",
  },
});
