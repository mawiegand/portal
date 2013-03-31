require 'test_helper'

class StaticControllerTest < ActionController::TestCase
  test "should get legal" do
    get :legal
    assert_response :success
  end

  test "should get agb" do
    get :agb
    assert_response :success
  end

  test "should get privacy" do
    get :privacy
    assert_response :success
  end

end
