package space.npc.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import space.npc.model.Users;
import space.npc.model.UsersExample;

public interface UsersMapper {
    /* @mbggenerated */
    int countByExample(UsersExample example);

    /* @mbggenerated */
    int deleteByExample(UsersExample example);

    /* @mbggenerated */
    int deleteByPrimaryKey(Integer userId);

    /* @mbggenerated */
    int insert(Users record);

    /* @mbggenerated */
    int insertSelective(Users record);

    /* @mbggenerated */
    List<Users> selectByExample(UsersExample example);

    /* @mbggenerated */
    Users selectByPrimaryKey(Integer userId);

    /* @mbggenerated */
    int updateByExampleSelective(@Param("record") Users record, @Param("example") UsersExample example);

    /* @mbggenerated */
    int updateByExample(@Param("record") Users record, @Param("example") UsersExample example);

    /* @mbggenerated */
    int updateByPrimaryKeySelective(Users record);

    /* @mbggenerated */
    int updateByPrimaryKey(Users record);
}