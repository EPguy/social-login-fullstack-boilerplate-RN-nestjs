import { Button, FlatList, Text, TextInput, View } from 'react-native';
import * as kakao from '@react-native-seoul/kakao-login';
import React, { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../store/config';
import { AuthTypeEnum } from '../enum/AuthTypeEnum';
import useTodo from '../hooks/useTodo';
import { Todo } from '../models/todo/Todo';
import TodoItem from '../components/todo/TodoItem';

const MainScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const { loginType } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();
  const { userInfo, getUserInfo } = useUser();
  const { data, getTodoList, insertTodo } = useTodo();

  useEffect(() => {
    getTodoList(null);
  }, [getTodoList]);

  const doLogout = async () => {
    switch (loginType) {
      case AuthTypeEnum.KAKAO:
        await kakao.logout();
        break;
    }

    const success = await logout();
    if (success) {
      navigation.navigate('SigninScreen');
    }
  };

  return (
    <View>
      <Text>{userInfo?.nickname}님 안녕하세요.</Text>
      <TextInput
        onChangeText={(text) => setTitle(text)}
        value={title}
        placeholder="Todo를 입력해주세요.."
      />
      <Button title="투두 저장" onPress={() => insertTodo({ title })} />
      <Button title="유저 정보 가져오기" onPress={() => getUserInfo()} />
      <Button title="로그아웃" onPress={() => doLogout()} />
      <FlatList<Todo>
        data={data?.todos}
        renderItem={({ item }) => <TodoItem todo={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={() => {}}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default MainScreen;
