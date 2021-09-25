$(document).ready(function () {
    window.Parsley.addValidator('checkemoji', {
        requirementType: 'string',
        validateString: function (value, requirement, parsleyInstance) {
            let enteredInput = value;
            if (/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi
                .test(enteredInput)) {
                return false;
            }
        },
        messages: {
            en: 'The value is incorrect.'
        }
    });

    $("#selectAll").click(function () {
        if ($(this).is(":checked")) {
            $('.emailNotification').prop('checked', true);
        } else {
            $('.emailNotification').prop('checked', false);
        }
    });
});
/**
 * @name hideLoader
 * 
 */
function hideLoader() {
    $('#rpLoader').fadeOut()
}

/**
 * @name showLoader
 * @param {*} message 
 */
function showLoader(message = null) {
    if (message != '' && message != null) {
        $('#loaderMessage').html(message);
    } else {
        $('#loaderMessage').html('Loading...');
    }
    $('#rpLoader').fadeIn();
}

function sendEmailNotification(userId, notificationStatus, requestType) {
    let buttonTest = "Yes, send it!";
    if (notificationStatus == 1) {
        buttonTest = "Yes, re-send it!";
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "Welcome email will be sent to the user. You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: buttonTest
    }).then((result) => {
        if (result.value) {
            showLoader('Sending email notification, please wait..')
            $.ajax({
                url: "/user/send-email-notification",
                data: {
                    id: userId,
                    request_type: requestType
                },
                type: 'POST',
                async: false,
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
}

function sendBulkEmailNotification(requestType) {
    var selectedUser = [];
    $.each($(".emailNotification:checked"), function () {
        selectedUser.push($(this).val());
    });
    if (selectedUser == "" || selectedUser == null || selectedUser == undefined) {
        toastr.error("Please select atleast one checkbox to send email notification.");
        return false;
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "Welcome email will be sent to all the users which are checked mark. You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, send it!'
    }).then((result) => {
        if (result.value) {
            showLoader('Sending email notification(s), please wait..');
            $.ajax({
                url: "/user/send-bulk-email-notification",
                data: {
                    user_ids: JSON.stringify(selectedUser),
                    request_type: requestType
                },
                type: 'POST',
                async: false,
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
}

function sendMSReport(requestType) {
    
    var selectedCampaign = [];
    $.each($(".emailNotification:checked"), function () {
        selectedCampaign.push($(this).val());
    });
    
    if (selectedCampaign == "" || selectedCampaign == null || selectedCampaign == undefined) {
        toastr.error("Please select atleast one checkbox to send email notification.");
        return false;
    }
    Swal.fire({
        title: 'Input email address',
        text: "Report will be sent to the respective email",
        input: 'email',
        inputPlaceholder: 'Enter your email address'

        // title: 'Are you sure?',
        // text: "Report will be sent to the respective email",
        // icon: 'warning',
        // showCancelButton: true,
        // confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        // confirmButtonText: 'Yes, send it!'
    }).then((result) => {
        if (result.value) {
            showLoader('Sending email notification(s), please wait..');
            $.ajax({
                url: "/campaign/reportMs",
                data: {
                    campaign_ids: JSON.stringify(selectedCampaign),
                    email_id: result.value
                },
                type: 'POST',
                async: false,
                success: function (data) {
                    location.reload();
                }
            });
        }
    });
}