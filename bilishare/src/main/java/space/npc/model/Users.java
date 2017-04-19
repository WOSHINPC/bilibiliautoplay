package space.npc.model;

public class Users {
    /**
     * id
     */
    private Integer userId;

    /**
     * 用户名
     */
    private String account;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 密码
     */
    private String password;

    /**
     * id
     * @return user_id id
     */
    public Integer getUserId() {
        return userId;
    }

    /**
     * id
     * @param userId id
     */
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    /**
     * 用户名
     * @return account 用户名
     */
    public String getAccount() {
        return account;
    }

    /**
     * 用户名
     * @param account 用户名
     */
    public void setAccount(String account) {
        this.account = account == null ? null : account.trim();
    }

    /**
     * 昵称
     * @return nickname 昵称
     */
    public String getNickname() {
        return nickname;
    }

    /**
     * 昵称
     * @param nickname 昵称
     */
    public void setNickname(String nickname) {
        this.nickname = nickname == null ? null : nickname.trim();
    }

    /**
     * 密码
     * @return password 密码
     */
    public String getPassword() {
        return password;
    }

    /**
     * 密码
     * @param password 密码
     */
    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }
}